import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/utils/prisma";
import { z } from "zod";
import { getSession } from "@/app/utils/authentication";

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
    const {
      id,
      email,
      name,
      department,
      type,
      course,
      year,
      password,
      confirmPassword,
    } = createUserSchema.parse(body);

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Bad Request" }, { status: 401 });
    }

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
        name: name,
        hashedPassword: hashedPassword,
        contact: contact,
        role: type,
      },
    });

    if (type === "student") {
      await prisma.students.create({
        data: {
          student_id: user.user_id,
          department: department,
          grade_level: year,
          program: course,
        },
      });
    } else {
      await prisma.teachers.create({
        data: {
          teacher_id: user.user_id,
          department: department,
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

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  const { sessionData } = await getSession();

  const { counselorPassword } = request.json();

  if (sessionData.role !== "counselor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const counselor = await prisma.users.findUnique({
      where: {
        user_id: sessionData.id,
      },
    });

    const confirmPassword = await bcrypt.compare(
      counselorPassword,
      counselor.hashedPassword
    );

    if (!confirmPassword) {
      return NextResponse.json(
        { message: "Incorrect Password" },
        { status: 401 }
      );
    }

    await prisma.users.delete({
      where: {
        user_id: id,
      },
    });

    return NextResponse.json({ message: "User Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  const { sessionData } = await getSession();

  if (sessionData.role !== "counselor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { role } = request.json();

  try {
    await prisma.users.update({
      where: {
        user_id: id,
      },
      data: {
        role: role,
      },
    });

    return NextResponse.json({ message: "User Updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
