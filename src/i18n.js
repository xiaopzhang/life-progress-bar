const translations = {
  en: {
    meta: {
      title: "Life Progress Bar",
      description: "Life Progress Bar is an immersive life calendar that lets you see time as a finite wall of weeks.",
      ogTitle: "Life Progress Bar",
      ogDesc: "If life were a countdown, how much would you have left?",
    },
    intro: {
      eyebrow: "Life Progress Bar",
      title: "If life were a countdown,<br />how much would you have left?",
      form: {
        birth: "Date of birth",
        year: "Year",
        month: "Month",
        day: "Day",
        country: "Country or region",
        countryDefault: "Detecting your location...",
        countrySelect: "Select a country or region",
        countryOther: "Others · world average",
        submit: "See my life progress",
        restart: "Start again",
        errorDate: "Please enter a real date of birth.",
        errorFuture: "A future birth date cannot hold a past yet.",
      },
    },
    result: {
      sound: {
        ariaLabel: "Ambient sound",
        silent: "Silent",
        rain: "Rain",
        wind: "Wind",
        ocean: "Ocean",
      },
      header: {
        eyebrow: "UN WPP 2024 estimate",
        title: "A finite wall of weeks.",
      },
      calendar: {
        eyebrow: "Life Calendar",
        title: "Each dot is one week.",
        ariaLabel: "Each dot represents one week of life",
        modeLife: "1000 weeks mode",
        modeThousand: "return to life calendar",
        captionLoading: "The wall is about to appear.",
        captionThousand: "A thousand future weeks. Not a prediction, just a smaller window to stand inside.",
        captionLife: "{total} weeks estimated. {elapsed} have already gone quiet.",
      },
      progress: {
        ariaLabel: "Life progress",
        youHaveLived: "You have lived",
        ofThisLife: "of this statistical life.",
        birth: "birth",
        expectedHorizon: "expected horizon",
        basis: "This uses the UN WPP {year} average life expectancy at birth for {country}: {expectancy} years. On that horizon, you have lived {percent}%.",
      },
      metrics: {
        ariaLabel: "Remaining life moments",
        weekendsLabel: "you may have",
        weekendsUnit: "weekends left.",
        sunsetsLabel: "perhaps",
        sunsetsUnit: "sunsets left.",
        summersLabel: "roughly",
        summersUnit: "summers left.",
        worldCupsLabel: "about",
        worldCupsUnit: "FIFA World Cups left.",
        decadesLabel: "maybe",
        decadesUnit: "decades left.",
        halleysLabel: "possibly",
        halleysUnit: "visits from Halley’s Comet.",
      },
      timeline: {
        ariaLabel: "Your life against world history",
        eyebrow: "Your Life in History",
        title: "The world you lived through.",
        emptyState: "No major world events to show for this window of time.",
        agePrefix: "age {age}",
        thatYear: "that year",
        yrBefore: "{n} yr before",
      },
      closing: {
        sourceNote: "Life expectancy uses UN World Population Prospects 2024 / UNData, indicator: life expectancy at birth, both sexes. This is a contemplative estimate, not a prediction.",
      },
      poster: {
        brand: "LIFE PROGRESS BAR",
        youHaveLived: "You have lived",
        ofThisLife: "of this statistical life.",
        birth: "birth",
        expectedHorizon: "expected horizon",
        calendarEyebrow: "LIFE CALENDAR",
        statsLabels: ["you may have", "perhaps", "roughly"],
        statsUnits: ["weekends left.", "sunsets left.", "World Cups left."],
        source: "{country} · UN WPP {year} · {expectancy} years",
        scanQuietly: "scan quietly",
        invitation: "What’s your number? Scan to see.",
        modal: {
          eyebrow: "Share poster",
          title: "A quiet invitation for someone else.",
          imgAlt: "Generated life progress share poster preview",
          download: "Download",
          share: "Share",
          close: "Close",
        },
      },
      share: {
        title: "Life Progress Bar",
        text: "A finite wall of weeks.",
        errorNotAvailable: "Sharing is not available in this browser. You can download the poster instead.",
        errorCancelled: "Sharing was cancelled or unavailable. The poster is still ready to download.",
      },
    },
    quotes: [
      "A life is not counted in years, but in chances.",
      "Time does not disappear suddenly. It goes dim.",
      "Some summers have already happened for the last time.",
      "What remains is not time. It is number.",
      "You thought there would be more years. There are only more times.",
      "The calendar does not move. We move through it.",
      "One day, an ordinary evening becomes part of the archive.",
      "The quietest truth is that every week has a border.",
    ],
    posterQuotes: [
      "Some summers have already happened for the last time.",
      "Time does not disappear suddenly. It goes dim.",
      "You thought there would be more years. There are only more times.",
      "The quietest truth is that every week has a border.",
      "One day, an ordinary evening becomes part of the archive.",
      "What remains is not time. It is number.",
      "The calendar does not move. We move through it.",
      "A life is measured not in years, but in the moments that take your breath away.",
    ],
    worldEvents: [
      { year: 2025, title: "AI agents emerged", desc: "Software began to write, code, and think alongside humans." },
      { year: 2022, title: "ChatGPT launched", desc: "AI entered everyday conversation for the first time." },
      { year: 2020, title: "A global pandemic", desc: "Much of the world stayed home. Everything paused." },
      { year: 2019, title: "First black hole image", desc: "Humanity saw the shadow of a black hole for the first time." },
      { year: 2016, title: "Brexit", desc: "The United Kingdom voted to leave the European Union." },
      { year: 2012, title: "Curiosity landed on Mars", desc: "A rover began sending back images from another planet." },
      { year: 2010, title: "Instagram launched", desc: "The age of visual social media began." },
      { year: 2008, title: "Bitcoin was born", desc: "A new idea of money entered the world." },
      { year: 2007, title: "iPhone launched", desc: "The internet entered every human hand." },
      { year: 2005, title: "YouTube went online", desc: "Anyone could now broadcast to the world." },
      { year: 2004, title: "Facebook went global", desc: "A social network began connecting the planet." },
      { year: 2001, title: "September 11", desc: "The world changed overnight." },
      { year: 1998, title: "Google was founded", desc: "A garage startup began organizing the world’s information." },
      { year: 1997, title: "Deep Blue won", desc: "A machine defeated the world chess champion." },
      { year: 1995, title: "The web went public", desc: "The internet arrived in ordinary homes." },
      { year: 1991, title: "The World Wide Web", desc: "A new digital universe was born." },
      { year: 1989, title: "The Berlin Wall fell", desc: "The Cold War quietly ended." },
      { year: 1986, title: "Chernobyl", desc: "A nuclear disaster sent a warning to the world." },
      { year: 1981, title: "The first PC", desc: "The personal computer arrived on desks." },
      { year: 1977, title: "Star Wars premiered", desc: "Cinema — and what it could be — changed forever." },
      { year: 1969, title: "Moon landing", desc: "Humans walked on another world for the first time." },
      { year: 1964, title: "The Beatles in America", desc: "Popular music was transformed overnight." },
      { year: 1961, title: "First human in space", desc: "Yuri Gagarin orbited the Earth alone." },
      { year: 1957, title: "Sputnik launched", desc: "The Space Age began with a small beeping sphere." },
      { year: 1953, title: "DNA discovered", desc: "The code of life was cracked open." },
      { year: 1945, title: "World War II ended", desc: "The United Nations was established. Peace began." },
    ],
    personalContext: [
      { max: -1, text: "The world was preparing for you." },
      { max: 1, text: "You had just arrived." },
      { max: 5, text: "You were discovering the world for the first time." },
      { max: 9, text: "You were learning how everything works." },
      { max: 12, text: "You were beginning to find your own voice." },
      { max: 15, text: "You were becoming yourself." },
      { max: 18, text: "You were about to step into the wider world." },
      { max: 22, text: "You were building a life of your own." },
      { max: 28, text: "You were finding your place in the world." },
      { max: 35, text: "You were deep in the middle of things." },
      { max: 45, text: "You were seeing the world more clearly." },
      { max: 55, text: "You had lived enough to know what matters." },
      { max: Infinity, text: "You had seen the world turn many times." },
    ],
    countries: {
      World: "World",
      China: "China",
      Japan: "Japan",
      "United States": "United States",
      Switzerland: "Switzerland",
      France: "France",
      "United Kingdom": "United Kingdom",
      Germany: "Germany",
      Italy: "Italy",
      "Russian Federation": "Russia",
      Singapore: "Singapore",
      Brazil: "Brazil",
    },
  },

  zh: {
    meta: {
      title: "人生进度条",
      description: "人生进度条是一个沉浸式生命日历，让你看到时间是一面有限的周之墙。",
      ogTitle: "人生进度条",
      ogDesc: "如果生命是一场倒计时，你还剩多少？",
    },
    intro: {
      eyebrow: "人生进度条",
      title: "如果生命是一场倒计时，<br />你还剩多少？",
      form: {
        birth: "出生日期",
        year: "年份",
        month: "月份",
        day: "日",
        country: "国家或地区",
        countryDefault: "正在检测你的位置...",
        countrySelect: "选择国家或地区",
        countryOther: "其他 · 世界平均",
        submit: "查看我的人生进度",
        restart: "重新开始",
        errorDate: "请输入真实的出生日期。",
        errorFuture: "未来的出生日期无法计算过往。",
      },
    },
    result: {
      sound: {
        ariaLabel: "环境音效",
        silent: "静音",
        rain: "雨声",
        wind: "风声",
        ocean: "海浪",
      },
      header: {
        eyebrow: "联合国 WPP 2024 估算",
        title: "一面有限的周之墙。",
      },
      calendar: {
        eyebrow: "生命日历",
        title: "每个点是一周。",
        ariaLabel: "每个点代表一周的生命",
        modeLife: "1000 周模式",
        modeThousand: "返回生命日历",
        captionLoading: "这面墙即将出现。",
        captionThousand: "一千个未来的周。不是预测，只是一扇更小的窗，站在里面。",
        captionLife: "估计 {total} 周。其中 {elapsed} 周已经安静地过去了。",
      },
      progress: {
        ariaLabel: "人生进度",
        youHaveLived: "你已经度过了",
        ofThisLife: "这段统计寿命的",
        birth: "出生",
        expectedHorizon: "预期寿命",
        basis: "此数据基于联合国 WPP {year} 年 {country} 出生时预期寿命：{expectancy} 岁。在这个尺度下，你已经度过了 {percent}%。",
      },
      metrics: {
        ariaLabel: "剩余的人生时刻",
        weekendsLabel: "你可能还有",
        weekendsUnit: "个周末。",
        sunsetsLabel: "大概还能看见",
        sunsetsUnit: "次日落。",
        summersLabel: "粗略还有",
        summersUnit: "个夏天。",
        worldCupsLabel: "大约还能看",
        worldCupsUnit: "届世界杯。",
        decadesLabel: "也许还有",
        decadesUnit: "个十年。",
        halleysLabel: "或许还能见到",
        halleysUnit: "次哈雷彗星。",
      },
      timeline: {
        ariaLabel: "你的人生与世界历史",
        eyebrow: "你的人生在历史中",
        title: "你经历过的这个世界。",
        emptyState: "这段时间窗口没有重大世界事件。",
        agePrefix: "{age} 岁",
        thatYear: "那一年",
        yrBefore: "出生前 {n} 年",
      },
      closing: {
        sourceNote: "预期寿命数据来源于联合国世界人口展望 2024 / UNData，指标：出生时预期寿命（男女合计）。这是一个沉思性的估算，不是预测。",
      },
      poster: {
        brand: "LIFE PROGRESS BAR",
        youHaveLived: "你已经度过了",
        ofThisLife: "这段统计寿命的",
        birth: "出生",
        expectedHorizon: "预期寿命",
        calendarEyebrow: "生命日历",
        statsLabels: ["你可能还有", "大概还能看见", "粗略还能看"],
        statsUnits: ["个周末。", "次日落。", "届世界杯。"],
        source: "{country} · 联合国 WPP {year} · {expectancy} 岁",
        scanQuietly: "轻轻扫一下",
        invitation: "你的数字是多少？扫码查看。",
        modal: {
          eyebrow: "分享海报",
          title: "给某个人的一份安静邀请。",
          imgAlt: "生成的人生进度分享海报预览",
          download: "下载",
          share: "分享",
          close: "关闭",
        },
      },
      share: {
        title: "人生进度条",
        text: "一面有限的周之墙。",
        errorNotAvailable: "此浏览器不支持分享。你可以下载海报。",
        errorCancelled: "分享已取消或不可用。海报仍然可以下载。",
      },
    },
    quotes: [
      "生命不是用年来计算的，而是用机会。",
      "时间不会突然消失。它只是慢慢熄灭。",
      "有些夏天，其实已经是最后一次了。",
      "剩下的不是时间，是数字。",
      "你以为还有很多年。只是还有很多次。",
      "日历不会动。是我们在穿过它。",
      "总有一天，一个平凡的傍晚成为档案的一部分。",
      "最安静的真相是：每一周都有边界。",
    ],
    posterQuotes: [
      "有些夏天，其实已经是最后一次了。",
      "时间不会突然消失。它只是慢慢熄灭。",
      "你以为还有很多年。只是还有很多次。",
      "最安静的真相是：每一周都有边界。",
      "总有一天，一个平凡的傍晚成为档案的一部分。",
      "剩下的不是时间，是数字。",
      "日历不会动。是我们在穿过它。",
      "生命不是用年来衡量的，而是用那些让你屏息的瞬间。",
    ],
    worldEvents: [
      { year: 2025, title: "AI 代理出现", desc: "软件开始与人类一起写作、编程和思考。" },
      { year: 2022, title: "ChatGPT 发布", desc: "AI 首次进入了日常对话。" },
      { year: 2020, title: "全球疫情", desc: "世界大部分人留在家中。一切暂停。" },
      { year: 2019, title: "首张黑洞照片", desc: "人类首次看到了黑洞的影子。" },
      { year: 2016, title: "英国脱欧", desc: "英国公投决定脱离欧洲联盟。" },
      { year: 2012, title: "好奇号登陆火星", desc: "一辆火星车开始从另一个星球发回图像。" },
      { year: 2010, title: "Instagram 诞生", desc: "视觉社交媒体的时代开启了。" },
      { year: 2008, title: "比特币诞生", desc: "一种全新的货币概念进入了世界。" },
      { year: 2007, title: "iPhone 发布", desc: "互联网进入了每个人的手中。" },
      { year: 2005, title: "YouTube 上线", desc: "任何人都可以向世界广播了。" },
      { year: 2004, title: "Facebook 走向全球", desc: "一个社交网络开始连接地球。" },
      { year: 2001, title: "9/11 事件", desc: "世界在一夜之间改变了。" },
      { year: 1998, title: "Google 创立", desc: "一家车库创业公司开始整理世界信息。" },
      { year: 1997, title: "深蓝获胜", desc: "一台机器击败了世界象棋冠军。" },
      { year: 1995, title: "互联网走进家庭", desc: "互联网来到了普通人的家中。" },
      { year: 1991, title: "万维网诞生", desc: "一个全新的数字宇宙诞生了。" },
      { year: 1989, title: "柏林墙倒塬", desc: "冷战安静地结束了。" },
      { year: 1986, title: "切尔诺贝利", desc: "一场核灾难向世界发出了警告。" },
      { year: 1981, title: "第一台个人电脑", desc: "个人电脑登上了桌面。" },
      { year: 1977, title: "《星球大战》首映", desc: "电影——以及它所能成为的一切——从此改变。" },
      { year: 1969, title: "人类登月", desc: "人类首次走上了另一个世界。" },
      { year: 1964, title: "甲壳虫在美国", desc: "流行音乐在一夜之间被彻底改变。" },
      { year: 1961, title: "人类首次进入太空", desc: "尤里·加加林独自绕地球轨道飞行。" },
      { year: 1957, title: "史浦尼克发射", desc: "太空时代从一个小小的嘀嘀声球体开始。" },
      { year: 1953, title: "DNA 双螺旋发现", desc: "生命的代码被破解了。" },
      { year: 1945, title: "二战结束", desc: "联合国成立。和平开始。" },
    ],
    personalContext: [
      { max: -1, text: "世界在为你的到来做准备。" },
      { max: 1, text: "你刚刚来到这个世界。" },
      { max: 5, text: "你第一次开始探索这个世界。" },
      { max: 9, text: "你在学习一切是如何运作的。" },
      { max: 12, text: "你开始找到自己的声音。" },
      { max: 15, text: "你正在成为自己。" },
      { max: 18, text: "你即将走向更广阔的世界。" },
      { max: 22, text: "你在建立属于自己的生活。" },
      { max: 28, text: "你在寻找自己在世界中的位置。" },
      { max: 35, text: "你正处在人生最繁忙的阶段。" },
      { max: 45, text: "你对世界看得更清楚了。" },
      { max: 55, text: "你已经活得足够久，知道什么才重要。" },
      { max: Infinity, text: "你已经看到世界转动了很多次。" },
    ],
    countries: {
      World: "世界",
      China: "中国",
      Japan: "日本",
      "United States": "美国",
      Switzerland: "瑞士",
      France: "法国",
      "United Kingdom": "英国",
      Germany: "德国",
      Italy: "意大利",
      "Russian Federation": "俄罗斯",
      Singapore: "新加坡",
      Brazil: "巴西",
    },
  },
};

let activeLang = "en";

function t(key, params) {
  const keys = key.split(".");
  let val = translations[activeLang];
  for (const k of keys) {
    if (val === undefined || val === null) return key;
    val = val[k];
  }
  if (typeof val !== "string") return key;
  if (params) {
    return val.replace(/\{(\w+)\}/g, (_, name) => (params[name] !== undefined ? params[name] : `{${name}}`));
  }
  return val;
}

function setLang(lang) {
  if (!translations[lang]) return;
  activeLang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.documentElement.setAttribute("data-lang", lang);
  try { localStorage.setItem("life-progress-lang", lang); } catch (_) { /* ignore */ }
  hydrateDOM();
  // Tell main.js to re-render (if result is showing)
  window.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

function hydrateDOM() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = t(key);
    if (text && text !== key) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = text;
      } else if (el.tagName === "META") {
        el.setAttribute("content", text);
      } else {
        el.innerHTML = text;
      }
    }
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const raw = el.getAttribute("data-i18n-attr");
    const [attr, key] = raw.split(":");
    const text = t(key);
    if (text && text !== key) el.setAttribute(attr, text);
  });
  // Update <title>
  const title = t("meta.title");
  if (title && title !== "meta.title") document.title = title;
}

function initI18n() {
  // 1. URL param
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get("lang");
  if (urlLang && translations[urlLang]) {
    activeLang = urlLang;
  } else {
    // 2. localStorage
    try {
      const stored = localStorage.getItem("life-progress-lang");
      if (stored && translations[stored]) activeLang = stored;
    } catch (_) { /* ignore */ }
    // 3. browser language
    if (activeLang === "en") {
      const browserLang = navigator.language || "";
      if (browserLang.startsWith("zh")) activeLang = "zh";
    }
  }
  // Apply
  document.documentElement.lang = activeLang === "zh" ? "zh-CN" : "en";
  document.documentElement.setAttribute("data-lang", activeLang);
  hydrateDOM();
  document.title = t("meta.title");
}

function tCountry(name) {
  const map = translations[activeLang].countries;
  return (map && map[name]) || name;
}

// Export
window.__t = t;
window.__tCountry = tCountry;
window.__setLang = setLang;
window.__getLang = () => activeLang;
window.__initI18n = initI18n;
window.__getWorldEvents = () => translations[activeLang].worldEvents;
window.__getQuotes = () => translations[activeLang].quotes;
window.__getPosterQuotes = () => translations[activeLang].posterQuotes;
window.__getPersonalContext = () => translations[activeLang].personalContext;
