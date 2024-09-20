import { encrypt } from "@/app/utils/authentication";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";

/**
 *
 * user entering the right and existing credential are logged in and given a role
 *
 * @function loginUser
 *
 * @param {Request} request request object containing the JSON body { email, password }
 *
 * @param {string} email      email used for validating login credential
 * @param {string} password   password credential to be compared to hashed password in the database
 *
 * @returns {NextResponse} NextResponse object containing message and role of the user
 *
 *
 */

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid Credential" },
        { status: 404 }
      );
    }

    const passwordMatched = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatched) {
      return NextResponse.json(
        { message: "Password did not match" },
        { status: 400 }
      );
    }

    const sessionData = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const expires = new Date(Date.now() + 60 * 60 * 1000);

    const session = await encrypt({ sessionData, expires });

    const isProduction = process.env.NODE_ENV === "production";

    cookies().set("session", session, {
      expires,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });

    return NextResponse.json(
      { message: "Successful login", role: sessionData.role },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
