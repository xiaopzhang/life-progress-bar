const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_YEAR = 365.2425;
const WEEKS_PER_YEAR = 52;

// PayPal.Me — replace with your username
const PAYPAL_USERNAME = "chizinho";

const lifeExpectancy = [
  { label: "World", iso3: "WLD", expectancyYears: 73.3, sourceYear: 2024, aliases: ["global", "earth", "other", "others"] },
  { label: "China", iso3: "CHN", expectancyYears: 78.2, sourceYear: 2024, aliases: ["prc", "mainland china"] },
  { label: "Japan", iso3: "JPN", expectancyYears: 84.8, sourceYear: 2024, aliases: ["nihon"] },
  { label: "United States", iso3: "USA", expectancyYears: 79.5, sourceYear: 2024, aliases: ["usa", "us", "america", "united states of america"] },
  { label: "Switzerland", iso3: "CHE", expectancyYears: 84.3, sourceYear: 2024, aliases: ["swiss"] },
  { label: "France", iso3: "FRA", expectancyYears: 83.3, sourceYear: 2024, aliases: [] },
  { label: "United Kingdom", iso3: "GBR", expectancyYears: 81.6, sourceYear: 2024, aliases: ["uk", "great britain", "britain", "england"] },
  { label: "Germany", iso3: "DEU", expectancyYears: 81.4, sourceYear: 2024, aliases: ["deutschland"] },
  { label: "Italy", iso3: "ITA", expectancyYears: 83.7, sourceYear: 2024, aliases: ["italia"] },
  { label: "Russian Federation", iso3: "RUS", expectancyYears: 73.4, sourceYear: 2024, aliases: ["russia"] },
  { label: "Singapore", iso3: "SGP", expectancyYears: 84.3, sourceYear: 2024, aliases: [] },
  { label: "Brazil", iso3: "BRA", expectancyYears: 76.8, sourceYear: 2024, aliases: ["brasil"] },
];

// i18n helpers (fall back to raw key if i18n.js hasn't loaded)
const t = (k, p) => (window.__t ? window.__t(k, p) : k);
const gEvents = () => (window.__getWorldEvents ? window.__getWorldEvents() : []);
const gQuotes = () => (window.__getQuotes ? window.__getQuotes() : []);
const gPosterQuotes = () => (window.__getPosterQuotes ? window.__getPosterQuotes() : []);
const gPersonalContext = () => (window.__getPersonalContext ? window.__getPersonalContext() : []);

function personalContext(age) {
  const contexts = gPersonalContext();
  for (const ctx of contexts) {
    if (age <= ctx.max) return ctx.text;
  }
  return "";
}

const state = {
  result: null,
  currentMode: "life",
  posterDataUrl: "",
  countryCode: "",
  audio: {
    context: null,
    nodes: [],
    active: "off",
  },
};

const elements = {
  app: document.querySelector("#app"),
  form: document.querySelector("#entryForm"),
  birthYear: document.querySelector("#birthYear"),
  birthMonth: document.querySelector("#birthMonth"),
  birthDay: document.querySelector("#birthDay"),
  countrySelect: document.querySelector("#countrySelect"),
  formNote: document.querySelector("#formNote"),
  resultView: document.querySelector("#resultView"),
  countrySource: document.querySelector("#countrySource"),
  progressPercent: document.querySelector("#progressPercent"),
  progressBarFill: document.querySelector("#progressBarFill"),
  progressBasis: document.querySelector("#progressBasis"),
  weekGrid: document.querySelector("#weekGrid"),
  calendarCaption: document.querySelector("#calendarCaption"),
  weeksModeButton: document.querySelector("#weeksModeButton"),
  weekendsLeft: document.querySelector("#weekendsLeft"),
  sunsetsLeft: document.querySelector("#sunsetsLeft"),
  summersLeft: document.querySelector("#summersLeft"),
  worldCupsLeft: document.querySelector("#worldCupsLeft"),
  decadesLeft: document.querySelector("#decadesLeft"),
  halleysCometLeft: document.querySelector("#halleysCometLeft"),
  closingLine: document.querySelector("#closingLine"),
  posterButton: document.querySelector("#posterButton"),
  posterModal: document.querySelector("#posterModal"),
  posterPreview: document.querySelector("#posterPreview"),
  posterDownloadButton: document.querySelector("#posterDownloadButton"),
  posterShareButton: document.querySelector("#posterShareButton"),
  posterCloseButton: document.querySelector("#posterCloseButton"),
  posterShareNote: document.querySelector("#posterShareNote"),
  restartButton: document.querySelector("#restartButton"),
  // Donation
  donateButton: document.querySelector("#donateButton"),
  donateModal: document.querySelector("#donateModal"),
  donateCloseButton: document.querySelector("#donateCloseButton"),
  donateCustomToggle: document.querySelector("#donateCustomToggle"),
  donateCustomInput: document.querySelector("#donateCustomInput"),
  donateCustomAmount: document.querySelector("#donateCustomAmount"),
  donateContinue: document.querySelector("#donateContinue"),
  donatePayPal: document.querySelector("#donatePayPal"),
  donateChina: document.querySelector("#donateChina"),
  qrWechat: document.querySelector("#qrWechat"),
  qrAlipay: document.querySelector("#qrAlipay"),
};

function mapEventsToLife(birthDate, currentAge) {
  const birthYear = birthDate.getFullYear();
  return gEvents()
    .filter((event) => event.year <= new Date().getFullYear())
    .map((event) => {
      const age = event.year - birthYear;
      return {
        ...event,
        age,
        context: personalContext(age),
      };
    })
    .sort((a, b) => a.year - b.year) // oldest first
    .filter((e) => e.age >= 0 && e.age <= currentAge);
}

function renderTimeline(events, birthDate, currentAge) {
  const container = document.querySelector("#timelineContainer");
  if (!container) return;
  container.innerHTML = "";

  if (events.length === 0) {
    container.innerHTML =
      '<p class="timeline-empty">No major world events to show for this window of time.</p>';
    return;
  }

  events.forEach((event, index) => {
    const card = document.createElement("article");
    card.className = "tl-card";
    card.style.setProperty("--i", index);

    // Left: timeline node
    const node = document.createElement("div");
    node.className = "tl-node";
    if (event.age === currentAge || event.age === currentAge - 1) {
      node.classList.add("is-now");
    }
    card.appendChild(node);

    // Right: card content
    const body = document.createElement("div");
    body.className = "tl-body";

    // Top row: title + age
    const topRow = document.createElement("div");
    topRow.className = "tl-top";

    const title = document.createElement("span");
    title.className = "tl-title";
    title.textContent = event.title;
    topRow.appendChild(title);

    const ageTag = document.createElement("span");
    ageTag.className = "tl-age";
    if (event.age < 0) {
      ageTag.textContent = t("result.timeline.yrBefore", { n: Math.abs(event.age) });
    } else if (event.age === 0) {
      ageTag.textContent = t("result.timeline.thatYear");
    } else {
      ageTag.textContent = t("result.timeline.agePrefix", { age: event.age });
    }
    topRow.appendChild(ageTag);

    body.appendChild(topRow);

    // Description
    const desc = document.createElement("p");
    desc.className = "tl-desc";
    desc.textContent = event.desc;
    body.appendChild(desc);

    // Personal context
    const ctx = document.createElement("p");
    ctx.className = "tl-context";
    ctx.textContent = event.context;
    body.appendChild(ctx);

    card.appendChild(body);
    container.appendChild(card);
  });
}

async function detectCountryByIP() {
  try {
    const resp = await fetch("https://ipapi.co/json/");
    if (!resp.ok) return;
    const data = await resp.json();
    if (data.error) return; // rate-limited or other API error
    const code = (data.country_code || "").toUpperCase();
    const name = (data.country_name || "").trim();
    state.countryCode = code;

    // Auto-set language for Chinese users (unless URL param overrides)
    const urlParams = new URLSearchParams(window.location.search);
    const hasUrlLang = urlParams.has("lang");
    if (code === "CN" && !hasUrlLang) {
      try {
        const stored = localStorage.getItem("life-progress-lang");
        if (!stored || stored === "zh") {
          if (window.__setLang) window.__setLang("zh");
          document.querySelectorAll(".lang-btn").forEach((b) => {
            b.classList.toggle("is-active", b.dataset.lang === "zh");
          });
        }
      } catch (_) { /* ignore */ }
    }

    // Try exact match on label or ISO3 code first
    let match = lifeExpectancy.find(
      (item) => item.iso3 === code || item.label.toLowerCase() === name.toLowerCase()
    );
    // Fallback: check aliases
    if (!match) {
      match = lifeExpectancy.find(
        (item) => item.aliases.some((a) => a.toLowerCase() === name.toLowerCase())
      );
    }
    if (match && match.iso3 !== "WLD") {
      elements.countrySelect.value = match.label;
    } else {
      // Leave as default
      elements.countrySelect.value = "";
    }
  } catch {
    // Silently fail — user can pick manually
  }
}

function setupLangSwitcher() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (window.__setLang) window.__setLang(lang);
      document.querySelectorAll(".lang-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
    });
  });

  // Sync button state on page load
  const currentLang = window.__getLang ? window.__getLang() : "en";
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.lang === currentLang);
  });
}

function handleLangChange() {
  // Rebuild form dropdowns
  seedCountryList();
  seedBirthSelectors();
  updateDayOptions();

  // Re-render result if showing
  if (state.result) {
    const result = state.result;
    const cName = window.__tCountry ? window.__tCountry(result.country.label) : result.country.label;
  elements.countrySource.textContent = t("result.poster.source", { country: cName, year: result.country.sourceYear, expectancy: result.country.expectancyYears.toFixed(1) });
    elements.progressBasis.textContent = buildProgressBasis(result);
    elements.closingLine.textContent = gQuotes()[Math.floor(Math.random() * gQuotes().length)];
    renderCalendar(result);
    const currentAge = Math.floor(result.elapsedDays / DAYS_PER_YEAR);
    const events = mapEventsToLife(result.birthDate, currentAge);
    renderTimeline(events, result.birthDate, currentAge);
  }
}

function init() {
  seedCountryList();
  seedBirthSelectors();
  detectCountryByIP();
  setupParticles();
  setupPointerParallax();
  setupSoundControls();
  setupAging();
  setupLangSwitcher();
  bindEvents();
  window.addEventListener("langchange", handleLangChange);
}

function seedCountryList() {
  const countries = lifeExpectancy.filter((item) => item.iso3 !== "WLD");
  const options = countries
    .map((item) => {
      const name = window.__tCountry ? window.__tCountry(item.label) : item.label;
      return `<option value="${item.label}">${name} · ${item.expectancyYears.toFixed(1)} yr</option>`;
    })
    .join("");
  elements.countrySelect.innerHTML =
    `<option value="">${t("intro.form.countrySelect")}</option>${options}<option value="Others">${t("intro.form.countryOther")}</option>`;
}

function seedBirthSelectors() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const earliestYear = currentYear - 120;
  const yearOptions = [`<option value="">${t("intro.form.year")}</option>`];
  for (let year = currentYear; year >= earliestYear; year -= 1) {
    yearOptions.push(`<option value="${year}">${year}</option>`);
  }

  elements.birthYear.innerHTML = yearOptions.join("");
  elements.birthMonth.innerHTML =
    `<option value="">${t("intro.form.month")}</option>` +
    Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      return `<option value="${month}">${monthName(month)}</option>`;
    }).join("");
  updateDayOptions();
}

function bindEvents() {
  elements.birthYear.addEventListener("change", updateDayOptions);
  elements.birthMonth.addEventListener("change", updateDayOptions);

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const birthDate = parseBirthDate(
      elements.birthYear.value,
      elements.birthMonth.value,
      elements.birthDay.value
    );
    if (!birthDate) {
      showFormNote(t("intro.form.errorDate"));
      return;
    }
    if (birthDate > startOfToday()) {
      showFormNote(t("intro.form.errorFuture"));
      return;
    }

    const country = resolveCountry(elements.countrySelect.value);
    const result = calculateLife(birthDate, country);
    state.result = result;
    state.currentMode = "life";
    renderResult(result);
  });

  elements.weeksModeButton.addEventListener("click", () => {
    if (!state.result) return;
    state.currentMode = state.currentMode === "life" ? "thousand" : "life";
    renderCalendar(state.result);
  });

  elements.posterButton.addEventListener("click", () => {
    if (state.result) {
      previewPoster(state.result);
    }
  });

  elements.posterDownloadButton.addEventListener("click", () => {
    if (state.posterDataUrl) {
      downloadPoster(state.posterDataUrl);
    }
  });

  elements.posterShareButton.addEventListener("click", () => {
    if (state.posterDataUrl) {
      sharePoster(state.posterDataUrl);
    }
  });

  elements.posterCloseButton.addEventListener("click", closePosterPreview);
  elements.posterModal.addEventListener("click", (event) => {
    if (event.target === elements.posterModal) closePosterPreview();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!elements.posterModal.hidden) closePosterPreview();
      if (!elements.donateModal.hidden) closeDonateModal();
    }
  });

  elements.restartButton.addEventListener("click", () => {
    stopSound();
    setActiveButton("[data-sound]", document.querySelector('[data-sound="off"]'));
    elements.app.dataset.stage = "intro";
    elements.form.reset();
    elements.countrySelect.selectedIndex = 0;
    updateDayOptions();
    elements.formNote.textContent = "";
    elements.birthYear.focus();
  });

  // Donation
  elements.donateButton.addEventListener("click", openDonateModal);
  elements.donateCloseButton.addEventListener("click", closeDonateModal);
  elements.donateModal.addEventListener("click", (event) => {
    if (event.target === elements.donateModal) closeDonateModal();
  });

  // QR tab switching (event delegation)
  elements.donateChina.addEventListener("click", (event) => {
    const tab = event.target.closest(".donate-qr-tab");
    if (tab) switchQrTab(tab.dataset.tab);
  });

  document.querySelectorAll(".donate-amount").forEach((btn) => {
    btn.addEventListener("click", () => {
      const amount = btn.dataset.amount;
      if (amount === "custom") {
        toggleCustomAmount();
      } else {
        openPayPal(amount);
      }
    });
  });

  elements.donateContinue.addEventListener("click", () => {
    const val = elements.donateCustomAmount.value;
    if (val && Number(val) > 0) {
      openPayPal(val);
    }
  });

  elements.donateCustomAmount.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const val = elements.donateCustomAmount.value;
      if (val && Number(val) > 0) {
        openPayPal(val);
      }
    }
  });
}

function showFormNote(message) {
  elements.formNote.textContent = message;
}

function updateDayOptions() {
  const selectedDay = Number(elements.birthDay.value);
  const year = Number(elements.birthYear.value) || new Date().getFullYear();
  const month = Number(elements.birthMonth.value) || 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayOptions = [`<option value="">${t("intro.form.day")}</option>`];

  for (let day = 1; day <= daysInMonth; day += 1) {
    dayOptions.push(`<option value="${day}">${day}</option>`);
  }

  elements.birthDay.innerHTML = dayOptions.join("");
  if (selectedDay && selectedDay <= daysInMonth) {
    elements.birthDay.value = String(selectedDay);
  }
}

function parseBirthDate(yearValue, monthValue, dayValue) {
  if (!yearValue || !monthValue || !dayValue) return null;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isValid ? date : null;
}

function monthName(month) {
  const locale = window.__getLang && window.__getLang() === "zh" ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(2000, month - 1, 1));
}

function resolveCountry(input) {
  const normalized = normalize(input);
  const exact = lifeExpectancy.find((item) => {
    const terms = [item.label, item.iso3, ...item.aliases].map(normalize);
    return terms.includes(normalized);
  });
  return exact || lifeExpectancy[0];
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ");
}

function calculateLife(birthDate, country) {
  const today = startOfToday();
  const expectedDays = Math.round(country.expectancyYears * DAYS_PER_YEAR);
  const elapsedDays = Math.max(0, Math.floor((today - birthDate) / MS_PER_DAY));
  const remainingDays = Math.max(0, expectedDays - elapsedDays);
  const totalWeeks = Math.round(country.expectancyYears * WEEKS_PER_YEAR);
  const elapsedWeeks = Math.min(Math.floor(elapsedDays / 7), totalWeeks);
  const progress = Math.min(1, elapsedDays / expectedDays);
  const summers = remainingDays === 0 ? 0 : Math.ceil(remainingDays / DAYS_PER_YEAR);

  // Halley's Comet: count how many future apparitions the user is expected to live through
  const nextApparition = 2061; // Next perihelion ~July 28, 2061
  const orbitalPeriod = 75.3;
  const deathYear = birthDate.getFullYear() + country.expectancyYears;
  let apparition = nextApparition;
  let remainingHalleys = 0;
  while (apparition <= deathYear) {
    remainingHalleys += 1;
    apparition = Math.round(apparition + orbitalPeriod);
  }

  return {
    birthDate,
    country,
    expectedDays,
    elapsedDays,
    remainingDays,
    elapsedWeeks,
    totalWeeks,
    progress,
    progressPercent: progress * 100,
    remainingWeekends: Math.floor(remainingDays / 7),
    remainingSummers: summers,
    remainingSunsets: remainingDays,
    remainingWorldCups: Math.floor(remainingDays / (DAYS_PER_YEAR * 4)),
    remainingDecades: Math.floor(remainingDays / (DAYS_PER_YEAR * 10)),
    remainingHalleysComet: remainingHalleys,
  };
}

function renderResult(result) {
  elements.app.dataset.stage = "result";
  elements.app.dataset.revealed = "false";
  const cName = window.__tCountry ? window.__tCountry(result.country.label) : result.country.label;
  elements.countrySource.textContent = t("result.poster.source", { country: cName, year: result.country.sourceYear, expectancy: result.country.expectancyYears.toFixed(1) });
  elements.progressBasis.textContent = buildProgressBasis(result);
  elements.closingLine.textContent = gQuotes()[Math.floor(Math.random() * gQuotes().length)];
  elements.weekGrid.innerHTML = "";
  elements.calendarCaption.textContent = t("result.calendar.captionLoading");
  animateNumbers(result);
  updateProgressBar(0);

  const currentAge = Math.floor(result.elapsedDays / DAYS_PER_YEAR);
  const events = mapEventsToLife(result.birthDate, currentAge);
  renderTimeline(events, result.birthDate, currentAge);

  window.setTimeout(() => {
    elements.app.dataset.revealed = "true";
    elements.resultView.scrollIntoView({ behavior: "smooth", block: "start" });
    updateProgressBar(result.progressPercent);
    window.setTimeout(() => renderCalendar(result), 180);
  }, 80);
}

function buildProgressBasis(result) {
  return t("result.progress.basis", {
    year: result.country.sourceYear,
    country: result.country.label,
    expectancy: result.country.expectancyYears.toFixed(1),
    percent: result.progressPercent.toFixed(1),
  });
}

function renderCalendar(result) {
  const isThousand = state.currentMode === "thousand";
  const total = isThousand ? 1000 : result.totalWeeks;
  const elapsed = isThousand ? 0 : result.elapsedWeeks;
  const current = isThousand ? -1 : Math.min(result.elapsedWeeks, total - 1);
  const fragment = document.createDocumentFragment();

  elements.weekGrid.innerHTML = "";
  elements.weekGrid.classList.toggle("is-thousand", isThousand);
  elements.weeksModeButton.textContent = isThousand
    ? t("result.calendar.modeThousand")
    : t("result.calendar.modeLife");

  for (let index = 0; index < total; index += 1) {
    const dot = document.createElement("span");
    dot.className = "week-dot";
    if (index < elapsed) dot.classList.add("is-lived");
    if (index > elapsed) dot.classList.add("is-remaining");
    if (index === current) dot.classList.add("is-current");
    dot.style.setProperty("--delay", `${Math.min(index * 2, 2400)}ms`);
    fragment.appendChild(dot);
  }

  elements.weekGrid.appendChild(fragment);
  const elapsedW = Math.min(result.elapsedWeeks, result.totalWeeks);
  elements.calendarCaption.textContent = isThousand
    ? t("result.calendar.captionThousand")
    : t("result.calendar.captionLife", {
        total: result.totalWeeks.toLocaleString(),
        elapsed: elapsedW.toLocaleString(),
      });
}

function animateNumbers(result) {
  animateNumber(elements.progressPercent, result.progressPercent, {
    decimals: 1,
    suffix: "",
    duration: 1800,
  });
  animateNumber(elements.weekendsLeft, result.remainingWeekends);
  animateNumber(elements.sunsetsLeft, result.remainingSunsets);
  animateNumber(elements.summersLeft, result.remainingSummers);
  animateNumber(elements.worldCupsLeft, result.remainingWorldCups);
  animateNumber(elements.decadesLeft, result.remainingDecades);
  animateNumber(elements.halleysCometLeft, result.remainingHalleysComet);
}

function animateNumber(element, target, options = {}) {
  const duration = options.duration || 2400;
  const decimals = options.decimals || 0;
  const start = performance.now();
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatter.format(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function updateProgressBar(percent) {
  const clamped = Math.max(0, Math.min(100, percent));
  elements.progressBarFill.style.width = `${clamped}%`;
  elements.progressBarFill.parentElement.style.setProperty("--progress", `${clamped}%`);
  elements.progressBarFill.closest(".life-line").setAttribute("aria-valuenow", clamped.toFixed(1));
}

function setupSoundControls() {
  document.querySelectorAll("[data-sound]").forEach((button) => {
    button.addEventListener("click", async () => {
      const sound = button.dataset.sound;
      setActiveButton("[data-sound]", button);
      if (sound === "off") {
        stopSound();
      } else {
        await playSound(sound);
      }
    });
  });
}

function setActiveButton(selector, activeButton) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("is-active", button === activeButton);
  });
}

async function playSound(type) {
  stopSound();
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = state.audio.context || new AudioContext();
  state.audio.context = context;
  if (context.state === "suspended") await context.resume();

  const master = context.createGain();
  master.gain.value = { rain: 0.07, wind: 0.16, ocean: 0.14 }[type] || 0.08;
  master.connect(context.destination);
  state.audio.nodes.push(master);

  if (type === "rain") createRain(context, master);
  if (type === "wind") createWind(context, master);
  if (type === "ocean") createOcean(context, master);
  state.audio.active = type;
}

function stopSound() {
  state.audio.nodes.forEach((node) => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch {
      // Audio nodes can already be disconnected after rapid switching.
    }
  });
  state.audio.nodes = [];
  state.audio.active = "off";
}

function createNoiseBuffer(context, seconds = 2) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createRain(context, destination) {
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  noise.buffer = createNoiseBuffer(context, 2);
  noise.loop = true;
  filter.type = "highpass";
  filter.frequency.value = 900;
  noise.connect(filter).connect(destination);
  noise.start();
  state.audio.nodes.push(noise, filter);
}

function createWind(context, destination) {
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const lowFilter = context.createBiquadFilter();
  const gain = context.createGain();
  const oscillator = context.createOscillator();
  const lfoGain = context.createGain();
  const tone = context.createOscillator();
  const toneGain = context.createGain();

  noise.buffer = createNoiseBuffer(context, 3);
  noise.loop = true;
  filter.type = "bandpass";
  filter.frequency.value = 380;
  filter.Q.value = 0.55;
  lowFilter.type = "lowpass";
  lowFilter.frequency.value = 760;
  oscillator.frequency.value = 0.07;
  lfoGain.gain.value = 0.09;
  gain.gain.value = 0.18;
  tone.type = "sine";
  tone.frequency.value = 92;
  toneGain.gain.value = 0.018;

  oscillator.connect(lfoGain).connect(gain.gain);
  noise.connect(filter).connect(lowFilter).connect(gain).connect(destination);
  tone.connect(toneGain).connect(destination);
  noise.start();
  oscillator.start();
  tone.start();
  state.audio.nodes.push(noise, filter, lowFilter, gain, oscillator, lfoGain, tone, toneGain);
}

function createOcean(context, destination) {
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const oscillator = context.createOscillator();
  const lfoGain = context.createGain();
  const sub = context.createOscillator();
  const subGain = context.createGain();

  noise.buffer = createNoiseBuffer(context, 4);
  noise.loop = true;
  filter.type = "lowpass";
  filter.frequency.value = 620;
  oscillator.frequency.value = 0.18;
  lfoGain.gain.value = 0.13;
  gain.gain.value = 0.14;
  sub.type = "sine";
  sub.frequency.value = 58;
  subGain.gain.value = 0.025;

  oscillator.connect(lfoGain).connect(gain.gain);
  noise.connect(filter).connect(gain).connect(destination);
  sub.connect(subGain).connect(destination);
  noise.start();
  oscillator.start();
  sub.start();
  state.audio.nodes.push(noise, filter, gain, oscillator, lfoGain, sub, subGain);
}

function setupPointerParallax() {
  window.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    document.documentElement.style.setProperty("--cursor-x", x.toFixed(3));
    document.documentElement.style.setProperty("--cursor-y", y.toFixed(3));
  });
}

function setupAging() {
  const start = performance.now();
  const root = document.documentElement;
  function age(now) {
    const minutes = Math.min(1, (now - start) / 240000);
    const textWarmth = Math.round(239 - minutes * 17);
    root.style.setProperty("--aged-text", `rgb(244, ${textWarmth}, ${Math.round(225 - minutes * 94)})`);
    root.style.setProperty("--grid-opacity", (0.22 + minutes * 0.12).toFixed(3));
    root.style.setProperty("--particle-opacity", (0.46 - minutes * 0.18).toFixed(3));
    root.style.setProperty("--aura-opacity", (0.64 - minutes * 0.2).toFixed(3));
    root.style.setProperty("--aura-breathe-opacity", (0.8 - minutes * 0.28).toFixed(3));
    root.style.setProperty("--breathe-duration", `${16 + minutes * 22}s`);
    root.style.setProperty("--glow-duration", `${6 + minutes * 10}s`);
    requestAnimationFrame(age);
  }
  requestAnimationFrame(age);
}

function setupParticles() {
  const canvas = document.querySelector("#particleCanvas");
  const context = canvas.getContext("2d");
  const particles = Array.from({ length: 64 }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: Math.random() * 1.3 + 0.35,
    speed: Math.random() * 0.00008 + 0.000025,
    alpha: Math.random() * 0.35 + 0.1,
  }));

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += Math.sin(performance.now() * 0.0001 + particle.radius) * 0.00008;
      if (particle.y < -0.02) {
        particle.y = 1.02;
        particle.x = Math.random();
      }
      context.beginPath();
      context.fillStyle = `rgba(245, 239, 222, ${particle.alpha})`;
      context.arc(
        particle.x * window.innerWidth,
        particle.y * window.innerHeight,
        particle.radius,
        0,
        Math.PI * 2
      );
      context.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
}

function previewPoster(result) {
  const canvas = createPosterCanvas(result);
  state.posterDataUrl = canvas.toDataURL("image/png");
  elements.posterPreview.src = state.posterDataUrl;
  elements.posterShareNote.textContent = "";
  elements.posterModal.hidden = false;
  elements.posterDownloadButton.focus();
}

function closePosterPreview() {
  elements.posterModal.hidden = true;
}

// ---- Donation ----

function isChinaUser() {
  return state.countryCode === "CN";
}

function openDonateModal() {
  if (isChinaUser()) {
    elements.donatePayPal.hidden = true;
    elements.donateChina.hidden = false;
    // Reset to WeChat tab
    switchQrTab("wechat");
  } else {
    elements.donatePayPal.hidden = false;
    elements.donateChina.hidden = true;
    elements.donateCustomInput.hidden = true;
    elements.donateCustomToggle.hidden = false;
    elements.donateCustomAmount.value = "";
  }
  elements.donateModal.hidden = false;
  elements.donateCloseButton.focus();
}

function closeDonateModal() {
  elements.donateModal.hidden = true;
}

function toggleCustomAmount() {
  elements.donateCustomToggle.hidden = true;
  elements.donateCustomInput.hidden = false;
  elements.donateCustomAmount.focus();
}

function switchQrTab(tab) {
  document.querySelectorAll(".donate-qr-tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tab === tab);
  });
  elements.qrWechat.hidden = tab !== "wechat";
  elements.qrAlipay.hidden = tab !== "alipay";
}

function openPayPal(amount) {
  const url = `https://paypal.me/${PAYPAL_USERNAME}/${amount}`;
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function createPosterCanvas(result) {
  const shareUrl = getShareUrl();
  const quote = gPosterQuotes()[Math.floor(Math.random() * gPosterQuotes().length)];
  const canvas = document.createElement("canvas");
  const width = 1080;
  const height = 1920;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  drawPosterBackground(ctx, width, height);
  drawPosterHeader(ctx, quote);
  drawPosterProgress(ctx, result, width);
  drawPosterCalendarAndStats(ctx, result, width);
  drawPosterFooter(ctx, result, shareUrl, width, height);

  return canvas;
}

function drawPosterBackground(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#050505");
  gradient.addColorStop(0.36, "#12120f");
  gradient.addColorStop(0.72, "#07100f");
  gradient.addColorStop(1, "#020303");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const auraOne = context.createRadialGradient(200, 250, 20, 200, 250, 560);
  auraOne.addColorStop(0, "rgba(222, 214, 170, 0.18)");
  auraOne.addColorStop(1, "rgba(222, 214, 170, 0)");
  context.fillStyle = auraOne;
  context.fillRect(0, 0, width, height);

  const auraTwo = context.createRadialGradient(900, 1320, 30, 900, 1320, 680);
  auraTwo.addColorStop(0, "rgba(135, 174, 165, 0.18)");
  auraTwo.addColorStop(1, "rgba(135, 174, 165, 0)");
  context.fillStyle = auraTwo;
  context.fillRect(0, 0, width, height);

  drawNoise(context, width, height, 9000);
  drawPosterStars(context, width, height);

  const vignette = context.createRadialGradient(width / 2, height / 2, 180, width / 2, height / 2, 1080);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.62)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);
}

function drawNoise(context, width, height, count) {
  context.save();
  for (let i = 0; i < count; i += 1) {
    const alpha = Math.random() * 0.035;
    context.fillStyle = `rgba(255,255,255,${alpha})`;
    context.fillRect(Math.random() * width, Math.random() * height, 1, 1);
  }
  context.restore();
}

function drawPosterStars(context, width, height) {
  context.save();
  for (let i = 0; i < 90; i += 1) {
    const radius = Math.random() * 1.4 + 0.3;
    context.beginPath();
    context.fillStyle = `rgba(244,239,225,${Math.random() * 0.38})`;
    context.arc(Math.random() * width, Math.random() * height, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function drawPosterHeader(ctx, quote) {
  ctx.save();
  ctx.fillStyle = "rgba(244,239,225,0.52)";
  ctx.font = "24px Inter, Arial, sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText(t("result.poster.brand"), 86, 112);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = "rgba(244,239,225,0.92)";
  ctx.font = '44px Georgia, "Times New Roman", serif';
  wrapCanvasText(ctx, quote, 86, 190, 820, 62);
  ctx.restore();
}

function drawPosterProgress(ctx, result, width) {
  const percent = parseFloat(result.progressPercent.toFixed(1));
  const barX = 86;
  const barW = 908;
  const barY = 600;
  const barH = 10;

  ctx.save();

  ctx.fillStyle = "rgba(244,239,225,0.64)";
  ctx.font = '28px Georgia, "Times New Roman", serif';
  ctx.fillText(t("result.poster.youHaveLived"), barX, 350);

  ctx.fillStyle = "#fff2c9";
  fitCanvasText(ctx, `${percent}%`, barX, 500, width - 172, 160, 'Georgia, "Times New Roman", serif');

  ctx.fillStyle = "rgba(244,239,225,0.64)";
  ctx.font = '28px Georgia, "Times New Roman", serif';
  ctx.fillText(t("result.poster.ofThisLife"), barX, 555);

  // Progress bar
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  fillRoundRect(ctx, barX, barY, barW, barH, barH / 2);

  const fillW = Math.max(barH, barW * (percent / 100));
  const fillGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  fillGrad.addColorStop(0, "rgba(244, 239, 225, 0.26)");
  fillGrad.addColorStop(1, "#ded6aa");
  ctx.fillStyle = fillGrad;
  fillRoundRect(ctx, barX, barY, fillW, barH, barH / 2);

  ctx.fillStyle = "#f4efe1";
  ctx.beginPath();
  ctx.arc(barX + fillW, barY + barH / 2, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(244, 239, 225, 0.38)";
  ctx.font = "15px Inter, Arial, sans-serif";
  ctx.fillText(t("result.poster.birth"), barX, barY + 34);
  ctx.textAlign = "right";
  ctx.fillText(t("result.poster.expectedHorizon"), barX + barW, barY + 34);
  ctx.textAlign = "left";

  // Source info
  ctx.fillStyle = "rgba(244,239,225,0.45)";
  ctx.font = "18px Inter, Arial, sans-serif";
  const countryName = window.__tCountry ? window.__tCountry(result.country.label) : result.country.label;
  ctx.fillText(
    t("result.poster.source", { country: countryName, year: result.country.sourceYear, expectancy: result.country.expectancyYears.toFixed(1) }),
    barX, barY + 72
  );

  ctx.restore();
}

function drawPosterCalendarAndStats(ctx, result, width) {
  ctx.save();

  // Section eyebrow
  ctx.fillStyle = "rgba(244,239,225,0.52)";
  ctx.font = "16px Inter, Arial, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText(t("result.poster.calendarEyebrow"), 86, 735);
  ctx.letterSpacing = "0px";

  // --- Left: full week grid ---
  const gridX = 86;
  const gridY = 765;
  const dotSize = 6;
  const gap = 2;
  const step = dotSize + gap;
  const cols = 52;
  const rows = Math.ceil(result.totalWeeks / cols);
  const gridW = cols * step;

  ctx.save();
  ctx.beginPath();
  ctx.rect(gridX - 4, gridY - 4, gridW + 8, rows * step + 8);
  ctx.clip();

  for (let i = 0; i < result.totalWeeks; i += 1) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const px = gridX + col * step;
    const py = gridY + row * step;
    const lived = i < result.elapsedWeeks;
    const isCurrent = i === result.elapsedWeeks;

    if (isCurrent) {
      ctx.fillStyle = "#f4efe1";
      ctx.shadowColor = "rgba(244, 239, 225, 0.55)";
      ctx.shadowBlur = 10;
    } else if (lived) {
      ctx.fillStyle = "rgba(244, 239, 225, 0.12)";
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = "rgba(222, 214, 170, 0.78)";
      ctx.shadowColor = "rgba(222, 214, 170, 0.18)";
      ctx.shadowBlur = 5;
    }

    fillRoundRect(ctx, px, py, dotSize, dotSize, dotSize * 0.35);
  }
  ctx.shadowBlur = 0;
  ctx.restore();

  // Fade top edge
  const fadeTop = ctx.createLinearGradient(0, gridY, 0, gridY + 30);
  fadeTop.addColorStop(0, "rgba(5,5,5,0.35)");
  fadeTop.addColorStop(1, "rgba(5,5,5,0)");
  ctx.fillStyle = fadeTop;
  ctx.fillRect(gridX - 4, gridY - 4, gridW + 8, 30);

  // --- Right: stats ---
  const statsX = 530;
  let cardY = 815;
  const cardH = 210;

  const labels = [t("result.poster.statsLabels.0"), t("result.poster.statsLabels.1"), t("result.poster.statsLabels.2")];
  const units = [t("result.poster.statsUnits.0"), t("result.poster.statsUnits.1"), t("result.poster.statsUnits.2")];
  const stats = [
    { label: labels[0], value: result.remainingWeekends, unit: units[0] },
    { label: labels[1], value: result.remainingSunsets, unit: units[1] },
    { label: labels[2], value: result.remainingWorldCups, unit: units[2] },
  ];

  stats.forEach((stat, idx) => {
    const top = cardY + idx * cardH;

    ctx.fillStyle = "rgba(244,239,225,0.48)";
    ctx.font = '19px Georgia, "Times New Roman", serif';
    ctx.fillText(stat.label, statsX, top);

    ctx.fillStyle = "#fff2c9";
    ctx.font = '56px Georgia, "Times New Roman", serif';
    const numText = stat.value.toLocaleString("en-US");
    const numWidth = ctx.measureText(numText).width;
    ctx.fillText(numText, Math.min(statsX, width - 86 - numWidth), top + 80);

    ctx.fillStyle = "rgba(244,239,225,0.64)";
    ctx.font = '21px Georgia, "Times New Roman", serif';
    ctx.fillText(stat.unit, statsX, top + 115);

    if (idx < 2) {
      ctx.strokeStyle = "rgba(244, 239, 225, 0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(statsX, top + 135);
      ctx.lineTo(statsX + 280, top + 135);
      ctx.stroke();
    }
  });

  ctx.restore();
}

function drawPosterFooter(ctx, result, shareUrl, width, height) {
  ctx.save();

  // Divider line
  ctx.strokeStyle = "rgba(244, 239, 225, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(86, 1470);
  ctx.lineTo(width - 86, 1470);
  ctx.stroke();

  // QR code
  drawQuietQr(ctx, shareUrl, width - 240, 1510, 180);

  // URL under QR
  ctx.fillStyle = "rgba(244,239,225,0.42)";
  ctx.font = "18px Inter, Arial, sans-serif";
  ctx.fillText(compactUrl(shareUrl), width - 240, 1730);

  // "scan quietly" below URL
  ctx.font = "14px Inter, Arial, sans-serif";
  ctx.fillText(t("result.poster.scanQuietly"), width - 240, 1758);

  // Invitation beside QR
  ctx.fillStyle = "rgba(244,239,225,0.72)";
  ctx.font = '24px Georgia, "Times New Roman", serif';
  wrapCanvasText(ctx, t("result.poster.invitation"), 86, 1640, 580, 36);

  ctx.restore();
}

function fillRoundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
  ctx.fill();
}

function fitCanvasText(context, text, x, baselineY, maxWidth, maxSize, fontFamily) {
  let size = maxSize;
  do {
    context.font = `${size}px ${fontFamily}`;
    size -= 4;
  } while (context.measureText(text).width > maxWidth && size > 96);
  context.fillText(text, x, baselineY);
}

function getShareUrl() {
  try {
    const url = new URL(window.location.href);
    if (url.protocol === "http:" || url.protocol === "https:") {
      url.hash = "";
      url.search = "";
      return url.toString();
    }
  } catch {
    // Fall through to the designed label for local file previews.
  }
  return "life-progress-bar";
}

function compactUrl(url) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function drawQuietQr(context, value, x, y, size) {
  const matrix = createQrMatrix(value);
  const cells = matrix.length;
  const cell = size / cells;

  context.save();
  context.fillStyle = "rgba(244,239,225,0.9)";
  context.fillRect(x - 14, y - 14, size + 28, size + 28);
  context.fillStyle = "rgba(5,5,5,0.78)";

  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      if (matrix[row][col]) {
        context.fillRect(x + col * cell, y + row * cell, Math.ceil(cell), Math.ceil(cell));
      }
    }
  }
  context.restore();
}

function createQrMatrix(value) {
  const version = 5;
  const size = version * 4 + 17;
  const dataCodewords = 108;
  const errorCodewords = 26;
  const bytes = Array.from(new TextEncoder().encode(value)).slice(0, 100);
  const bits = [];
  appendBits(bits, 0b0100, 4);
  appendBits(bits, bytes.length, 8);
  bytes.forEach((byte) => appendBits(bits, byte, 8));
  appendBits(bits, 0, Math.min(4, dataCodewords * 8 - bits.length));
  while (bits.length % 8 !== 0) appendBits(bits, 0, 1);

  const data = [];
  for (let index = 0; index < bits.length; index += 8) {
    data.push(parseInt(bits.slice(index, index + 8).join(""), 2));
  }
  for (let pad = 0xec; data.length < dataCodewords; pad = pad === 0xec ? 0x11 : 0xec) {
    data.push(pad);
  }

  const codewords = [...data, ...reedSolomonRemainder(data, errorCodewords)];
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const setFunction = (x, y, dark) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    matrix[y][x] = dark;
    reserved[y][x] = true;
  };

  drawQrFinder(matrix, reserved, 0, 0);
  drawQrFinder(matrix, reserved, size - 7, 0);
  drawQrFinder(matrix, reserved, 0, size - 7);
  drawQrAlignment(matrix, reserved, 30, 30);

  for (let i = 8; i < size - 8; i += 1) {
    setFunction(i, 6, i % 2 === 0);
    setFunction(6, i, i % 2 === 0);
  }
  setFunction(8, size - 8, true);
  reserveFormatAreas(reserved);

  const dataBits = codewords.flatMap((word) =>
    Array.from({ length: 8 }, (_, index) => ((word >>> (7 - index)) & 1) === 1)
  );
  let bitIndex = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;
    for (let vertical = 0; vertical < size; vertical += 1) {
      const y = upward ? size - 1 - vertical : vertical;
      for (let offset = 0; offset < 2; offset += 1) {
        const x = right - offset;
        if (reserved[y][x]) continue;
        const bit = bitIndex < dataBits.length ? dataBits[bitIndex] : false;
        const masked = bit !== ((x + y) % 2 === 0);
        matrix[y][x] = masked;
        bitIndex += 1;
      }
    }
    upward = !upward;
  }

  drawFormatBits(matrix, reserved, 0b1000);
  return matrix;
}

function appendBits(bits, value, length) {
  for (let index = length - 1; index >= 0; index -= 1) {
    bits.push((value >>> index) & 1);
  }
}

function drawQrFinder(matrix, reserved, x, y) {
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || yy < 0 || yy >= matrix.length || xx >= matrix.length) continue;
      const inPattern = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
      const dark =
        inPattern &&
        (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      matrix[yy][xx] = dark;
      reserved[yy][xx] = true;
    }
  }
}

function drawQrAlignment(matrix, reserved, cx, cy) {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const x = cx + dx;
      const y = cy + dy;
      const dark = Math.max(Math.abs(dx), Math.abs(dy)) === 2 || (dx === 0 && dy === 0);
      matrix[y][x] = dark;
      reserved[y][x] = true;
    }
  }
}

function reserveFormatAreas(reserved) {
  const size = reserved.length;
  for (let i = 0; i < 9; i += 1) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i += 1) {
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }
}

function drawFormatBits(matrix, reserved, format) {
  const size = matrix.length;
  const bits = getFormatBits(format);
  const set = (x, y, bitIndex) => {
    matrix[y][x] = ((bits >>> bitIndex) & 1) !== 0;
    reserved[y][x] = true;
  };
  for (let i = 0; i <= 5; i += 1) set(8, i, i);
  set(8, 7, 6);
  set(8, 8, 7);
  set(7, 8, 8);
  for (let i = 9; i < 15; i += 1) set(14 - i, 8, i);
  for (let i = 0; i < 8; i += 1) set(size - 1 - i, 8, i);
  for (let i = 8; i < 15; i += 1) set(8, size - 15 + i, i);
}

function getFormatBits(format) {
  let data = format << 10;
  const generator = 0x537;
  for (let i = 14; i >= 10; i -= 1) {
    if (((data >>> i) & 1) !== 0) data ^= generator << (i - 10);
  }
  return ((format << 10) | data) ^ 0x5412;
}

function reedSolomonRemainder(data, degree) {
  const generator = reedSolomonGenerator(degree);
  const result = [...data, ...Array(degree).fill(0)];
  for (let i = 0; i < data.length; i += 1) {
    const factor = result[i];
    if (factor === 0) continue;
    for (let j = 0; j < generator.length; j += 1) {
      result[i + j] ^= gfMultiply(generator[j], factor);
    }
  }
  return result.slice(result.length - degree);
}

function reedSolomonGenerator(degree) {
  let result = [1];
  for (let i = 0; i < degree; i += 1) {
    const next = Array(result.length + 1).fill(0);
    result.forEach((coefficient, index) => {
      next[index] ^= coefficient;
      next[index + 1] ^= gfMultiply(coefficient, gfPow(2, i));
    });
    result = next;
  }
  return result;
}

function gfPow(value, power) {
  let result = 1;
  for (let i = 0; i < power; i += 1) {
    result = gfMultiply(result, value);
  }
  return result;
}

function gfMultiply(a, b) {
  let result = 0;
  for (let i = 0; i < 8; i += 1) {
    if ((b & 1) !== 0) result ^= a;
    const carry = (a & 0x80) !== 0;
    a = (a << 1) & 0xff;
    if (carry) a ^= 0x1d;
    b >>>= 1;
  }
  return result;
}

function downloadPoster(dataUrl) {
  const link = document.createElement("a");
  link.download = "life-progress-poster.png";
  link.href = dataUrl;
  link.click();
}

async function sharePoster(dataUrl) {
  elements.posterShareNote.textContent = "";
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], "life-progress-poster.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: t("result.share.title"),
        text: t("result.share.text"),
        files: [file],
      });
      return;
    }
    if (navigator.share) {
      await navigator.share({
        title: t("result.share.title"),
        text: t("result.share.text"),
      });
      return;
    }
    elements.posterShareNote.textContent = t("result.share.errorNotAvailable");
  } catch {
    elements.posterShareNote.textContent = t("result.share.errorCancelled");
  }
}

function drawPosterGrid(context, result, x, y, width, height) {
  const columns = 52;
  const rows = Math.ceil(result.totalWeeks / columns);
  const gap = 5;
  const dot = Math.min((width - gap * (columns - 1)) / columns, (height - gap * (rows - 1)) / rows);
  for (let i = 0; i < result.totalWeeks; i += 1) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const px = x + col * (dot + gap);
    const py = y + row * (dot + gap);
    context.fillStyle = i < result.elapsedWeeks ? "rgba(244,239,225,0.14)" : "rgba(222,214,170,0.78)";
    fillRoundRect(context, px, py, dot, dot, dot * 0.35);
  }
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  words.forEach((word, index) => {
    const test = `${line}${word} `;
    if (context.measureText(test).width > maxWidth && index > 0) {
      context.fillText(line, x, y);
      line = `${word} `;
      y += lineHeight;
    } else {
      line = test;
    }
  });
  context.fillText(line, x, y);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

init();
