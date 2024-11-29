import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { sessionData } = await getSession();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "pending";

  if (!sessionData || sessionData.role !== "counselor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const referrals = await prisma.referrals.findMany({
      where: {
        status: status,
        counselor_id: sessionData.userId,
      },
      orderBy: {
        dateSubmitted: "desc",
      },
      include: {
        student: {
          include: {
            student: {
              select: {
                name: true,
              },
            },
          },
        },
        teacher: {
          include: {
            teacher: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedReferrals = referrals.map((referral) => ({
      id: referral.referral_id,
      student_name: referral.student.student.name,
      teacher_name: referral.teacher.teacher.name,
      reason: referral.reason,
      dateSubmitted: referral.dateSubmitted,
      status: referral.status,
    }));

    return NextResponse.json(
      { referrals: formattedReferrals },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching ${status} referrals:`, error);
    return NextResponse.json(
      { message: `Error fetching ${status} referrals` },
      { status: 500 }
    );
  }
}
