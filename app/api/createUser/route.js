import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/utils/prisma";

export async function POST(request) {
  console.log("Request received");
  const { id, email, contact } = await request.json();

  console.log(id, email, contact);

  const password = "123";

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const emailExists = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (emailExists) {
      return NextResponse.json({ message: "Email Already Exists" });
    }

    const user = await prisma.users.create({
      data: {
        user_id: id,
        email: email,
        hashedPassword: hashedPassword,
        contact: contact,
      },
    });

    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
