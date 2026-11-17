/**
 * File: dev-server.js
 * Description: Local Node.js development server that emulates Vercel static hosting,
 *              cleanUrls/rewrites (/admin -> /admin/index.html), and serverless API functions
 *              (/api/leads and /api/auth).
 */

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const leadsHandler = require("./api/leads");
const authHandler = require("./api/auth");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function createServer() {
  return http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === "/api/leads") {
      return leadsHandler(req, res);
    }
    if (pathname === "/api/auth") {
      return authHandler(req, res);
    }

    let relativePath = pathname;
    if (relativePath === "/") {
      relativePath = "/index.html";
    } else if (relativePath === "/admin" || relativePath === "/admin/") {
      relativePath = "/admin/index.html";
    }

    // Block private/internal routes (notes, markdown files, dotfiles) from being served over HTTP
    const isPrivate =
      relativePath.startsWith("/.") ||
      relativePath === "/notes" ||
      relativePath.startsWith("/notes/") ||
      relativePath.endsWith(".md");

    if (isPrivate) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.end("Not Found");
    }

    const safePath = path.normalize(path.join(ROOT, relativePath));
    if (!safePath.startsWith(ROOT)) {
      res.statusCode = 403;
      return res.end("Forbidden");
    }

    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      const ext = path.extname(safePath).toLowerCase();
      res.statusCode = 200;
      res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
      return fs.createReadStream(safePath).pipe(res);
    }

    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Not Found");
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = { createServer };
