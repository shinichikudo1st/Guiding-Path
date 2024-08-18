import { encrypt } from "@/app/utils/authentication";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const expires = new Date(Date.now() + 60 * 60 * 1000);

    const session = await encrypt({ sessionData, expires });
    cookies().set("session", session, { expires, httpOnly: true });

    return NextResponse.json({ message: "Successful login" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
