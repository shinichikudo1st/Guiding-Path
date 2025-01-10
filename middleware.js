import { NextResponse } from "next/server";
import { getSession } from "./app/utils/authentication";

// Simple in-memory store for rate limiting
// const rateLimit = new Map();

// // Rate limit configuration
// const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
// const MAX_REQUESTS = 100;

const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:;",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

export async function middleware(request) {
  // Basic rate limiting
  // const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  // const now = Date.now();
  // const windowStart = now - RATE_LIMIT_WINDOW;

  // // Clean up old entries
  // for (const [key, timestamp] of rateLimit.entries()) {
  //   if (timestamp < windowStart) {
  //     rateLimit.delete(key);
  //   }
  // }

  // // Check rate limit
  // const requestCount = [...rateLimit.values()].filter(
  //   (timestamp) => timestamp > windowStart
  // ).length;

  // if (requestCount >= MAX_REQUESTS) {
  //   return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  // }

  // // Add current request to rate limit
  // rateLimit.set(`${ip}-${now}`, now);

  // Only check session for protected routes
  if (
    request.nextUrl.pathname.startsWith("/pages/") ||
    (request.nextUrl.pathname.startsWith("/api/") &&
      !request.nextUrl.pathname.includes("loginUser") &&
      !request.nextUrl.pathname.includes("userOption") &&
      !request.nextUrl.pathname.includes("forgot-password") &&
      !request.nextUrl.pathname.includes("reset-password") &&
      !request.nextUrl.pathname.includes("verify-email") &&
      !request.nextUrl.pathname.includes("resend-verification"))
  ) {
    const authorized = await getSession();
    if (!authorized) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Create response
  const response = NextResponse.next();

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/pages/teacherDashboard",
    "/pages/adminDashboard",
    "/pages/studentDashboard",
    "/((?!api/loginUser|api/userOption|api/forgot-password|api/reset-password|api/verify-email|api/resend-verification).*)", // Exclude login, registration, password reset and verification endpoints
  ],
};
