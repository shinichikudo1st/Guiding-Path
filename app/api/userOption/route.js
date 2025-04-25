import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/utils/prisma";
import { z } from "zod";
import { getSession } from "@/app/utils/authentication";
import { generateVerificationToken, sendVerificationEmail } from "@/app/utils/emailVerification";
import moment from "moment-timezone";

const createUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  contact: z.string(),
  password: z.string().min(8),
  type: z.string(),
  department: z.string(),
  course: z.string(),
  year: z.string(),
});
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
      contact,
    } = createUserSchema.parse(body);

    const checkRecord = await prisma.check.findUnique({
      where: {
        check_id: id,
      },
    });

    if (!checkRecord) {
      return NextResponse.json(
        { message: "Invalid ID: This ID is not registered in our system" },
        { status: 400 }
      );
    }

    if (checkRecord.role.toLowerCase() !== type.toLowerCase()) {
      return NextResponse.json(
        { message: `Invalid role: This ID is registered for ${checkRecord.role} role, not ${type}` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userIdExists = await prisma.users.findUnique({
      where: {
        user_id: id,
      },
    });

    if (userIdExists) {
      return NextResponse.json(
        { message: "This ID is already registered" },
        { status: 400 }
      );
    }

    const emailExists = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (emailExists) {
      if (emailExists.user_id === id) {
        return NextResponse.json(
          { message: "Cannot use existing id" },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { message: "Email Already Exists" },
          { status: 400 }
        );
      }
    }

    const verificationToken = generateVerificationToken();
    const verificationExpiry = moment().tz('Asia/Manila').add(24, 'hours').toDate();

    const user = await prisma.users.create({
      data: {
        user_id: id,
        email: email,
        name: name,
        hashedPassword: hashedPassword,
        contact: contact,
        role: type,
        verificationToken,
        verificationExpiry,
        emailVerified: false,
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

    try {
      await sendVerificationEmail(email, verificationToken, name);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    return NextResponse.json({ 
      message: "User Created. Please check your email to verify your account.",
      requiresVerification: true
    }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
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
