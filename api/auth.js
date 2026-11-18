/**
 * File: api/auth.js
 * Description: Serverless endpoint for /admin password login, session verification, and logout.
 */

"use strict";

const {
  getAdminPassword,
  verifyPassword,
  createSessionToken,
  isRequestAuthenticated,
  buildSessionCookie,
  buildLogoutCookie,
  getClientIp,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
} = require("../lib/auth");
const { sendJson, readJsonBody } = require("../lib/http");

module.exports = async function handler(req, res) {
  try {
    const isSecure =
      req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";

    if (req.method === "GET") {
      const authenticated = isRequestAuthenticated(req);
      return sendJson(res, 200, {
        ok: true,
        authenticated,
      });
    }

    if (req.method === "POST") {
      if (!getAdminPassword()) {
        return sendJson(res, 503, {
          ok: false,
          error: "ADMIN_PASSWORD is not configured on the server.",
        });
      }

      const clientIp = getClientIp(req);
      const rateStatus = await checkRateLimit(clientIp);
      if (rateStatus.blocked) {
        return sendJson(
          res,
          429,
          {
            ok: false,
            error: "Too many failed login attempts. Please try again in 15 minutes.",
          },
          { "Retry-After": String(rateStatus.retryAfterSeconds || 900) }
        );
      }

      const body = await readJsonBody(req);
      const password = String(body.password || "");

      if (!verifyPassword(password)) {
        await recordFailedAttempt(clientIp);
        return sendJson(res, 401, {
          ok: false,
          error: "Invalid admin password. Please try again.",
        });
      }

      await clearFailedAttempts(clientIp);
      const token = createSessionToken();
      const cookie = buildSessionCookie(token, isSecure);

      return sendJson(
        res,
        200,
        {
          ok: true,
          authenticated: true,
          token,
        },
        { "Set-Cookie": cookie }
      );
    }

    if (req.method === "DELETE") {
      const cookie = buildLogoutCookie(isSecure);
      return sendJson(
        res,
        200,
        {
          ok: true,
          authenticated: false,
        },
        { "Set-Cookie": cookie }
      );
    }

    return sendJson(res, 405, { ok: false, error: "Method not allowed." });
  } catch (err) {
    console.error("[api/auth] Error:", err);
    return sendJson(res, 500, {
      ok: false,
      error: err.message || "Internal server error",
    });
  }
};
