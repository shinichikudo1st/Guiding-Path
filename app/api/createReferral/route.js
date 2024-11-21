import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const referralSchema = z.object({
  studentId: z.string().min(1),
  reason: z.string().min(1),
  notes: z.string().min(1),
});

/**
 * @function createReferral Creates a new referral record in the database
 * @param {Request} request Request object with a JSON body containing studentId, reason, and notes
 * @returns {NextResponse}
 */
export async function POST(request) {
  const { sessionData } = await getSession();

  if (!sessionData || sessionData.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { studentId, reason, notes } = referralSchema.parse(body);

  try {
    const [newReferral, newNotification] = await Promise.all([
      prisma.referrals.create({
        data: {
          student_id: studentId,
          teacher_id: sessionData.id,
          reason: reason,
          notes: notes,
          status: "pending",
          counselor_id: "332570",
          dateSubmitted: new Date(),
        },
      }),
      prisma.notifications.create({
        data: {
          user_id: "332570",
          title: "New Referral Request",
          content: "You have a new referral request",
          date: new Date(),
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Referral created successfully", referral: newReferral },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating referral:", error);
    return NextResponse.json(
      { message: "Error creating referral" },
      { status: 500 }
    );
  }
}
