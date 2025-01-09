import { NextResponse } from "next/server";
import crypto from "crypto";
import moment from "moment-timezone";
import prisma from "@/app/utils/prisma";
import { z } from "zod";
import { sendPasswordResetEmail } from "@/app/utils/nodemailer";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

/**
 * @description Handle forgot password request and generate reset token
 * @function POST
 * @param {Request} request request object containing the JSON body { email }
 * @returns {Promise<NextResponse>} JSON response with status and message
 */
export async function POST(request) {
  console.log("[Forgot Password Route] - Starting");

  if (request.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    console.log("[Forgot Password Route] - Request body:", body);

    // Validate input
    const { email } = forgotPasswordSchema.parse(body);
    console.log("[Forgot Password Route] - Validated email:", email);

    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    // Even if user doesn't exist, we return success for security
    if (!user) {
      console.log("[Forgot Password Route] - User not found");
      return NextResponse.json(
        { message: "If an account exists, a reset link will be sent." },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = moment().tz("Asia/Manila").add(1, "hour");

    console.log("[Forgot Password Route] - Updating user with reset token");

    // Save reset token to database
    await prisma.users.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
      console.log("[Forgot Password Route] - Reset email sent successfully");
    } catch (emailError) {
      console.error("[Forgot Password Route] - Failed to send email:", emailError);
      // Don't expose email sending failure to client
    }

    console.log("[Forgot Password Route] - Successfully processed request");

    return NextResponse.json(
      { message: "If an account exists, a reset link will be sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Forgot Password Route] - Error:", error);
    return NextResponse.json(
      { message: "An error occurred during password reset." },
      { status: 500 }
    );
  }
}