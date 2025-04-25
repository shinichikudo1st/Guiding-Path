import { encrypt } from "@/app/utils/authentication";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import { z } from "zod";
import { generateVerificationToken, sendVerificationEmail } from "@/app/utils/emailVerification";
import moment from "moment-timezone";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    if (user.status === "archived") {
      return NextResponse.json(
        { message: "User is archived" },
        { status: 400 }
      );
    }

    const passwordMatched = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatched) {
      return NextResponse.json(
        { message: "Password did not match" },
        { status: 400 }
      );
    }

    if (!user.emailVerified) {
      const hasValidToken = user.verificationToken && user.verificationExpiry && 
                          moment(user.verificationExpiry).isAfter(moment().tz('Asia/Manila'));

      if (!hasValidToken) {
        const verificationToken = generateVerificationToken();
        const verificationExpiry = moment().tz('Asia/Manila').add(24, 'hours').toDate();

        await prisma.users.update({
          where: { user_id: user.user_id },
          data: {
            verificationToken,
            verificationExpiry,
          },
        });

        await sendVerificationEmail(user.email, verificationToken, user.name);
      }

      return NextResponse.json(
        { 
          message: "Please verify your email before logging in. Check your inbox for the verification link.",
          requiresVerification: true
        },
        { status: 403 }
      );
    }

    const sessionData = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    const expires = new Date(Date.now() + 2 * (60 * 60 * 1000));

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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
