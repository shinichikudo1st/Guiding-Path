import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/utils/prisma";
import { z } from "zod";
import moment from "moment-timezone";

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, newPassword } = resetPasswordSchema.parse(body);

    // Find user with valid reset token
    const user = await prisma.users.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: moment().tz("Asia/Manila").toDate(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token
    await prisma.users.update({
      where: { user_id: user.user_id },
      data: {
        hashedPassword: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "An error occurred while resetting password" },
      { status: 500 }
    );
  }
}
