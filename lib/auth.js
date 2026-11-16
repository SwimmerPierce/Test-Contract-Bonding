/**
 * File: lib/auth.js
 * Description: Stateless HMAC-SHA256 session token signing and password verification
 *              for the /admin dashboard on contractbonding.ca.
 *              Strictly requires ADMIN_PASSWORD from environment (.env locally or Vercel Env Vars).
 */

"use strict";

const crypto = require("crypto");
const { loadLocalEnv } = require("./env");

loadLocalEnv();

const COOKIE_NAME = "cb_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getAdminPassword() {
  return String(process.env.ADMIN_PASSWORD || "").trim();
}

function getSigningSecret() {
  const pwd = getAdminPassword();
  const db = process.env.DATABASE_URL || "contractbonding-salt";
  return crypto.createHash("sha256").update(`${pwd}::${db}::cb-admin-secret`).digest();
}

function safeCompare(a, b) {
  const bufA = Buffer.from(String(a || ""), "utf8");
  const bufB = Buffer.from(String(b || ""), "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyPassword(candidate) {
  const configured = getAdminPassword();
  if (!configured || !candidate) return false;
  return safeCompare(String(candidate).trim(), configured);
}

function createSessionToken() {
  const configured = getAdminPassword();
  if (!configured) {
    throw new Error("ADMIN_PASSWORD environment variable is not configured.");
  }

  const payload = {
    role: "admin",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${sig}`;
}

function verifySessionToken(token) {
  if (!getAdminPassword()) return false;
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return false;

  const expectedSig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(encoded)
    .digest("base64url");

  if (!safeCompare(sig, expectedSig)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return false;
    return payload.role === "admin";
  } catch (_) {
    return false;
  }
}

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  cookieHeader.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    out[key] = decodeURIComponent(val);
  });
  return out;
}

function isRequestAuthenticated(req) {
  if (!getAdminPassword()) return false;

  // 1. Check Authorization header: Bearer <token-or-password>
  const authHeader = req.headers["authorization"] || req.headers["Authorization"] || "";
  if (authHeader.startsWith("Bearer ")) {
    const raw = authHeader.slice(7).trim();
    if (verifySessionToken(raw) || verifyPassword(raw)) {
      return true;
    }
  }

  // 2. Check X-Admin-Password header
  const headerPassword = req.headers["x-admin-password"];
  if (headerPassword && verifyPassword(headerPassword)) {
    return true;
  }

  // 3. Check HttpOnly cookie
  const cookies = parseCookies(req.headers.cookie || "");
  if (cookies[COOKIE_NAME] && verifySessionToken(cookies[COOKIE_NAME])) {
    return true;
  }

  return false;
}

function buildSessionCookie(token, isSecure) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${SESSION_TTL_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isSecure) parts.push("Secure");
  return parts.join("; ");
}

function buildLogoutCookie(isSecure) {
  const parts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isSecure) parts.push("Secure");
  return parts.join("; ");
}

module.exports = {
  COOKIE_NAME,
  getAdminPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  isRequestAuthenticated,
  buildSessionCookie,
  buildLogoutCookie,
};
