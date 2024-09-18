import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

/**
 * @function createReferral Creates a new referral record in the database
 * @param {Request} request Request object with a JSON body containing studentId, teacherId, reason, and additionalNotes
 * @returns {NextResponse}
 */
export async function POST(request) {
  const { sessionData } = await getSession();

  if (!sessionData || sessionData.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { studentId, teacherId, reason, additionalNotes } =
    await request.json();

  try {
    const newReferral = await prisma.referrals.create({
      data: {
        student_id: studentId,
        teacher_id: teacherId,
        reason: reason,
        notes: additionalNotes,
        status: "pending",
        counselor_id: "332570",
        dateSubmitted: new Date(),
      },
    });

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
