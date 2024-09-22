import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { sessionData } = await getSession();
  const { searchParams } = new URL(request.url);
  const referralId = searchParams.get("id");

  if (!sessionData || sessionData.role !== "counselor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!referralId) {
    return NextResponse.json(
      { message: "Referral ID is required" },
      { status: 400 }
    );
  }

  try {
    const referral = await prisma.referrals.findUnique({
      where: {
        referral_id: parseInt(referralId),
        counselor_id: sessionData.userId,
      },
      include: {
        student: {
          select: {
            student: {
              select: {
                name: true,
                user_id: true,
              },
            },
          },
        },
        teacher: {
          select: {
            teacher: {
              select: {
                name: true,
              },
            },
          },
        },
        counselor: {
          select: {
            counselor: {
              select: {
                name: true,
                profilePicture: true,
              },
            },
          },
        },
        appointment: {
          select: {
            date_time: true,
          },
        },
      },
    });

    if (!referral) {
      return NextResponse.json(
        { message: "Referral not found" },
        { status: 404 }
      );
    }

    const formattedReferral = {
      id: referral.referral_id,
      student_name: referral.student.student.name,
      teacher_name: referral.teacher.teacher.name,
      student_id: referral.student.student.user_id,
      reason: referral.reason,
      dateSubmitted: referral.dateSubmitted,
      status: referral.status,
      notes: referral.notes,
      counselor_name: referral.counselor.counselor.name,
      counselor_profilePicture: referral.counselor.counselor.profilePicture,
      appointment_date_time: referral.appointment?.date_time || null,
    };

    return NextResponse.json({ referral: formattedReferral }, { status: 200 });
  } catch (error) {
    console.error("Error fetching referral:", error);
    return NextResponse.json(
      { message: "Error fetching referral" },
      { status: 500 }
    );
  }
}
