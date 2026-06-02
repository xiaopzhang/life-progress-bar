#!/usr/bin/env node
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const port = Number(process.env.PORT || process.argv[2] || 8080);
const hosts = ["127.0.0.1", "::1"];
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
]);

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "X-Content-Type-Options": "nosniff",
  });
  res.end(body);
}

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const pathname = decoded === "/" ? "/index.html" : decoded;
  const requested = path.resolve(root, `.${pathname}`);

  if (!requested.startsWith(root + path.sep) && requested !== root) {
    return null;
  }

  const info = await stat(requested).catch(() => null);
  if (!info) return null;
  if (info.isDirectory()) return path.join(requested, "index.html");
  return requested;
}

function createStaticServer() {
  return createServer(async (req, res) => {
    try {
      const file = await resolveFile(req.url || "/");
      if (!file) {
        send(res, 404, "Not found");
        return;
      }

      const info = await stat(file).catch(() => null);
      if (!info || !info.isFile()) {
        send(res, 404, "Not found");
        return;
      }

      const type = contentTypes.get(path.extname(file)) || "application/octet-stream";
      res.writeHead(200, {
        "Content-Length": info.size,
        "Content-Type": type,
        "X-Content-Type-Options": "nosniff",
      });
      createReadStream(file).pipe(res);
    } catch (error) {
      send(res, 500, `Server error: ${error.message}`);
    }
  });
}

async function listen(host) {
  const server = createStaticServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve();
    });
  });
  return server;
}

const servers = [];
const skipped = [];
const failures = [];

for (const host of hosts) {
  try {
    servers.push(await listen(host));
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      skipped.push(host);
    } else {
      failures.push({ host, error });
    }
  }
}

if (failures.length > 0) {
  for (const server of servers) server.close();
  for (const { host, error } of failures) {
    console.error(`Could not listen on ${host}:${port}: ${error.message}`);
  }
  process.exitCode = 1;
} else if (servers.length === 0) {
  console.error(`No listeners started on port ${port}; all target addresses are already in use.`);
  process.exitCode = 1;
} else {
  for (const host of skipped) {
    console.warn(`Skipped ${host}:${port}; it is already in use.`);
  }

  console.log(`Serving ${root}`);
  console.log(`  http://localhost:${port}/`);
  console.log(`  http://127.0.0.1:${port}/`);
  console.log(`  http://[::1]:${port}/`);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    for (const server of servers) server.close();
    process.exit(0);
  });
}
