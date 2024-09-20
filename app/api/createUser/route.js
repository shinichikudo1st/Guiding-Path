import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/utils/prisma";

/**
 *
 * @function createUser creates new record in the User schema with the provided inputs
 *
 * @param {Request} request request object with a JSON body containing { id, name, contact }
 * @param {Object} request.body JSON body of the request
 * @param {string} request.body.id ID of the user
 * @param {string} request.body.email Email of the user
 * @param {string} request.body.contact Contact of the user
 *
 * @returns {NextResponse}
 */

export async function POST(request) {
  console.log("Request received");
  const { id, email, contact } = await request.json();

  console.log(id, email, contact);

  const password = "123";
  const role = "student";

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
        role: role,
      },
    });

    if (user.role === "student") {
      await prisma.students.create({
        data: {
          student_id: user.user_id,
          grade_level: "N/A",
          program: "N/A",
        },
      });
    }

    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
