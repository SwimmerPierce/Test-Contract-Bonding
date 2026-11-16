/**
 * File: lib/env.js
 * Description: Loads local .env / .env.local files into process.env when running locally,
 *              without overriding variables already injected by Vercel or the shell.
 */

"use strict";

const fs = require("fs");
const path = require("path");

let loaded = false;

function loadLocalEnv() {
  if (loaded) return;
  loaded = true;

  const candidates = [".env.local", ".env"];
  for (const filename of candidates) {
    const filePath = path.join(process.cwd(), filename);
    if (!fs.existsSync(filePath)) continue;

    try {
      const content = fs.readFileSync(filePath, "utf8");
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) return;
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined) {
          process.env[key] = val;
        }
      });
    } catch (_) {
      // Ignore read errors
    }
  }
}

module.exports = { loadLocalEnv };
