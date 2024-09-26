import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/utils/prisma";
import { z } from "zod";

const createUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  contact: z.string(),
  password: z.string().min(8),
});

/**SANITIZED INPUTS
 *
 * @description createUser creates new record in the User schema with the provided inputs
 *
 * @param {Request} request request object with a JSON body containing { id, name, contact }
 * @param {Object} request.body JSON body of the request
 * @param {string} request.body.id ID of the user
 * @param {string} request.body.email Email of the user
 * @param {string} request.body.contact Contact of the user
 * @param {string} request.body.password Password of the user
 * @returns {NextResponse}
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, email, contact, password } = createUserSchema.parse(body);

    const role = "student";

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailExists = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (emailExists) {
      return NextResponse.json(
        { message: "Email Already Exists" },
        { status: 400 }
      );
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
    //console.error("Server error:", error); (for debugging)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.errors[0].message.replace("String", "Password"),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
