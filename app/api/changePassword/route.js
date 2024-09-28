import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

/**
 *
 * @function changePassword handles post request for changing the password of the user
 *
 *
 * @param {Request} request incoming request object that is expected to contain a JSON body with password
 * @param {Object} request.body JSON body of request
 * @param {string} request.body.password new password
 *
 * @returns {NextResponse}
 *
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { currentPassword, password, confirmPassword } =
      changePasswordSchema.parse(body);

    const { sessionData } = await getSession();

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!sessionData) {
      return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
    }

    const checkCurrentPassword = await prisma.users.findUnique({
      where: {
        user_id: sessionData.id,
      },
      select: {
        hashedPassword: true,
      },
    });

    const isMatch = await bcrypt.compare(
      currentPassword,
      checkCurrentPassword.hashedPassword
    );

    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect Current Password" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "New Password and Confirm Password do not match" },
        { status: 400 }
      );
    }

    await prisma.users.update({
      where: {
        user_id: sessionData.id,
      },
      data: {
        hashedPassword: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Password Changed" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
