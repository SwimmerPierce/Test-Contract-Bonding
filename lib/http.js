/**
 * File: lib/http.js
 * Description: Request body parsing and JSON response utilities for Node/Vercel API handlers.
 */

"use strict";

function sendJson(res, statusCode, data, extraHeaders = {}) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  Object.entries(extraHeaders).forEach(([k, v]) => {
    res.setHeader(k, v);
  });
  res.end(JSON.stringify(data));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === "string") {
    return req.body ? JSON.parse(req.body) : {};
  }
  if (Buffer.isBuffer(req.body)) {
    const str = req.body.toString("utf8");
    return str ? JSON.parse(str) : {};
  }

  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        reject(new Error("Request payload too large"));
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

module.exports = {
  sendJson,
  readJsonBody,
};
