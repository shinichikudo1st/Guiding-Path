import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing SECRET_KEY environment variable");
}

const key = new TextEncoder().encode(secretKey);

//Creates a JWT that contains the session payload.
export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

//Verifies and decodes a JWT
export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
  return payload;
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;

  return await decrypt(session);
}
