/**
 * File: lib/auth.js
 * Description: Stateless HMAC-SHA256 session token signing and password verification
 *              for the /admin dashboard on contractbonding.ca.
 *              Strictly requires ADMIN_PASSWORD from environment (.env locally or Vercel Env Vars).
 */

"use strict";

const crypto = require("crypto");
const { loadLocalEnv } = require("./env");
const { getSql } = require("./db");

loadLocalEnv();

const COOKIE_NAME = "cb_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const memoryRateMap = new Map();
let authTableReadyPromise = null;

async function ensureAuthTable(sql) {
  if (!authTableReadyPromise) {
    authTableReadyPromise = sql`
      CREATE TABLE IF NOT EXISTS auth_attempts (
        ip VARCHAR(128) PRIMARY KEY,
        fail_count INTEGER NOT NULL DEFAULT 0,
        window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.catch((err) => {
      authTableReadyPromise = null;
      throw err;
    });
  }
  return authTableReadyPromise;
}

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) {
    const first = String(fwd).split(",")[0].trim();
    if (first) return first;
  }
  const realIp = req.headers["x-real-ip"];
  if (realIp) return String(realIp).trim();
  return (req.socket && req.socket.remoteAddress) || "unknown";
}

async function checkRateLimit(ip) {
  const key = String(ip || "unknown").slice(0, 128);
  const now = Date.now();
  const sql = getSql();

  if (sql) {
    await ensureAuthTable(sql);
    const rows = await sql`
      SELECT fail_count, window_started_at
      FROM auth_attempts
      WHERE ip = ${key}
    `;
    if (!rows.length) return { blocked: false, retryAfterSeconds: 0 };
    const row = rows[0];
    const startedMs = new Date(row.window_started_at).getTime();
    const elapsedMs = now - startedMs;
    if (elapsedMs >= RATE_LIMIT_WINDOW_MS) {
      await sql`DELETE FROM auth_attempts WHERE ip = ${key}`;
      return { blocked: false, retryAfterSeconds: 0 };
    }
    if (Number(row.fail_count) >= RATE_LIMIT_MAX_ATTEMPTS) {
      const retryAfterSeconds = Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - elapsedMs) / 1000));
      return { blocked: true, retryAfterSeconds };
    }
    return { blocked: false, retryAfterSeconds: 0 };
  }

  const entry = memoryRateMap.get(key);
  if (!entry) return { blocked: false, retryAfterSeconds: 0 };
  const elapsedMs = now - entry.windowStartedAt;
  if (elapsedMs >= RATE_LIMIT_WINDOW_MS) {
    memoryRateMap.delete(key);
    return { blocked: false, retryAfterSeconds: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - elapsedMs) / 1000));
    return { blocked: true, retryAfterSeconds };
  }
  return { blocked: false, retryAfterSeconds: 0 };
}

async function recordFailedAttempt(ip) {
  const key = String(ip || "unknown").slice(0, 128);
  const now = Date.now();
  const sql = getSql();

  if (sql) {
    await ensureAuthTable(sql);
    const rows = await sql`
      SELECT fail_count, window_started_at
      FROM auth_attempts
      WHERE ip = ${key}
    `;
    if (!rows.length || now - new Date(rows[0].window_started_at).getTime() >= RATE_LIMIT_WINDOW_MS) {
      await sql`
        INSERT INTO auth_attempts (ip, fail_count, window_started_at)
        VALUES (${key}, 1, NOW())
        ON CONFLICT (ip) DO UPDATE
        SET fail_count = 1, window_started_at = NOW()
      `;
    } else {
      await sql`
        UPDATE auth_attempts
        SET fail_count = fail_count + 1
        WHERE ip = ${key}
      `;
    }
    return;
  }

  const existing = memoryRateMap.get(key);
  if (!existing || now - existing.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
    memoryRateMap.set(key, { count: 1, windowStartedAt: now });
  } else {
    existing.count += 1;
  }
}

async function clearFailedAttempts(ip) {
  const key = String(ip || "unknown").slice(0, 128);
  const sql = getSql();
  if (sql) {
    await ensureAuthTable(sql);
    await sql`DELETE FROM auth_attempts WHERE ip = ${key}`;
    return;
  }
  memoryRateMap.delete(key);
}

const ADMIN_USERS = [
  {
    email: "chase@nexusinsurancebrokers.com",
    envKey: "ADMIN_PASSWORD_CHASE",
  },
  {
    email: "ken@nexusinsurancebrokers.com",
    envKey: "ADMIN_PASSWORD_KEN",
  },
  {
    email: "nathan@nexusinsurancebrokers.com",
    envKey: "ADMIN_PASSWORD_NATHAN",
  },
];

function getAdminUsersMap() {
  const map = new Map();
  for (const u of ADMIN_USERS) {
    const pwd = String(process.env[u.envKey] || "").trim();
    if (pwd) {
      map.set(u.email.toLowerCase(), pwd);
    }
  }
  return map;
}

function hasConfiguredAdmin() {
  if (getAdminUsersMap().size > 0) return true;
  if (String(process.env.ADMIN_PASSWORD || "").trim()) return true;
  return false;
}

function getAdminPassword() {
  return String(process.env.ADMIN_PASSWORD || "").trim();
}

function getSigningSecret() {
  const usersMap = getAdminUsersMap();
  const serialized = Array.from(usersMap.entries())
    .map(([e, p]) => `${e}:${p}`)
    .sort()
    .join("::");
  const pwd = getAdminPassword();
  const db = process.env.DATABASE_URL || "contractbonding-salt";
  return crypto
    .createHash("sha256")
    .update(`${serialized}::${pwd}::${db}::cb-admin-secret`)
    .digest();
}

function safeCompare(a, b) {
  const bufA = Buffer.from(String(a || ""), "utf8");
  const bufB = Buffer.from(String(b || ""), "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyUserCredentials(candidateEmail, candidatePassword) {
  if (!candidatePassword) return { ok: false };
  const rawPwd = String(candidatePassword).trim();
  const usersMap = getAdminUsersMap();
  const email = candidateEmail ? String(candidateEmail).trim().toLowerCase() : "";

  // 1. If email was supplied, authenticate against that specific account
  if (email) {
    const expected = usersMap.get(email);
    if (expected && safeCompare(rawPwd, expected)) {
      return { ok: true, email };
    }
    // Also allow master ADMIN_PASSWORD if configured, provided the email is one of the 3 recognized users
    const masterPwd = getAdminPassword();
    if (masterPwd && safeCompare(rawPwd, masterPwd)) {
      const isRecognized = ADMIN_USERS.some((u) => u.email === email);
      if (isRecognized) {
        return { ok: true, email };
      }
    }
    return { ok: false };
  }

  // 2. If no email supplied (e.g. backward-compatible password-only prompt or script)
  for (const [userEmail, expected] of usersMap.entries()) {
    if (safeCompare(rawPwd, expected)) {
      return { ok: true, email: userEmail };
    }
  }

  const masterPwd = getAdminPassword();
  if (masterPwd && safeCompare(rawPwd, masterPwd)) {
    return { ok: true, email: "chase@nexusinsurancebrokers.com" };
  }

  return { ok: false };
}

function verifyPassword(candidate) {
  return verifyUserCredentials(null, candidate).ok;
}

function createSessionToken(user) {
  if (!hasConfiguredAdmin()) {
    throw new Error("No admin users or ADMIN_PASSWORD configured on the server.");
  }

  const email = (user && user.email) || "admin";
  const payload = {
    role: "admin",
    email,
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
  if (!hasConfiguredAdmin()) return null;
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(encoded)
    .digest("base64url");

  if (!safeCompare(sig, expectedSig)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return null;
    if (payload.role !== "admin") return null;
    return payload;
  } catch (_) {
    return null;
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

function getRequestUser(req) {
  if (!hasConfiguredAdmin()) return null;

  // 1. Check Authorization header: Bearer <token-or-password>
  const authHeader = req.headers["authorization"] || req.headers["Authorization"] || "";
  if (authHeader.startsWith("Bearer ")) {
    const raw = authHeader.slice(7).trim();
    const tokenPayload = verifySessionToken(raw);
    if (tokenPayload) {
      return { email: tokenPayload.email || "admin" };
    }
    const cred = verifyUserCredentials(null, raw);
    if (cred.ok) {
      return { email: cred.email };
    }
  }

  // 2. Check X-Admin-Password header
  const headerPassword = req.headers["x-admin-password"];
  if (headerPassword) {
    const cred = verifyUserCredentials(null, headerPassword);
    if (cred.ok) {
      return { email: cred.email };
    }
  }

  // 3. Check HttpOnly cookie
  const cookies = parseCookies(req.headers.cookie || "");
  if (cookies[COOKIE_NAME]) {
    const tokenPayload = verifySessionToken(cookies[COOKIE_NAME]);
    if (tokenPayload) {
      return { email: tokenPayload.email || "admin" };
    }
  }

  return null;
}

function isRequestAuthenticated(req) {
  return Boolean(getRequestUser(req));
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
  ADMIN_USERS,
  COOKIE_NAME,
  hasConfiguredAdmin,
  getAdminPassword,
  verifyPassword,
  verifyUserCredentials,
  createSessionToken,
  verifySessionToken,
  getRequestUser,
  isRequestAuthenticated,
  buildSessionCookie,
  buildLogoutCookie,
  getClientIp,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
};
