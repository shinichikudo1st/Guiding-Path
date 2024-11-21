import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function DELETE(request) {
  const { counselorPassword, userID } = await request.json();

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const counselor = await prisma.users.findUnique({
    where: {
      user_id: sessionData.id,
    },
  });

  const match = await bcrypt.compare(
    counselorPassword,
    counselor.hashed_password
  );

  if (!match) {
    return NextResponse.json({ message: "Wrong password" }, { status: 401 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        user_id: userID,
      },
    });

    if (userID === sessionData.id) {
      return NextResponse.json(
        { message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    if (!user || user.status !== "archived") {
      return NextResponse.json(
        { message: "User not found or is not archived" },
        { status: 404 }
      );
    }

    // Common deletions for all user types
    const commonDeletions = [
      prisma.notifications.deleteMany({
        where: { user_id: userID },
      }),
      prisma.user_Resources.deleteMany({
        where: { user_id: userID },
      }),
    ];

    // Role-specific deletions
    const roleDeletions = {
      student: [
        prisma.evaluation_Trends.deleteMany({
          where: { student_id: userID },
        }),
        prisma.appraisals.deleteMany({
          where: { student_id: userID },
        }),
        prisma.appointment_Requests.deleteMany({
          where: { student_id: userID },
        }),
        prisma.appointments.deleteMany({
          where: { student_id: userID },
        }),
        prisma.event_Registrations.deleteMany({
          where: { student_id: userID },
        }),
        prisma.referrals.deleteMany({
          where: { student_id: userID },
        }),
        prisma.students.delete({
          where: { student_id: userID },
        }),
      ],
      teacher: [
        prisma.referrals.deleteMany({
          where: { teacher_id: userID },
        }),
        prisma.teachers.delete({
          where: { teacher_id: userID },
        }),
      ],
      counselor: [
        prisma.referrals.deleteMany({
          where: { counselor_id: userID },
        }),
        prisma.appointments.deleteMany({
          where: { counselor_id: userID },
        }),
        prisma.counselors.delete({
          where: { counselor_id: userID },
        }),
      ],
    };

    // Add after the user lookup
    if (user.role === "counselor") {
      const activeCounselors = await prisma.users.count({
        where: {
          role: "counselor",
          status: "active",
        },
      });

      if (activeCounselors <= 1) {
        return NextResponse.json(
          { message: "Cannot delete the last active counselor" },
          { status: 400 }
        );
      }
    }

    // Execute all relevant deletions
    await prisma.$transaction([
      ...commonDeletions,
      ...(roleDeletions[user.role] || []),
      // Delete the user record last
      prisma.users.delete({
        where: { user_id: userID },
      }),
    ]);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
