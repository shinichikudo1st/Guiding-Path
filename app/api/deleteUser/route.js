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
    where: { user_id: sessionData.id },
  });

  const match = await bcrypt.compare(
    counselorPassword,
    counselor.hashedPassword
  );

  if (!match) {
    return NextResponse.json({ message: "Wrong password" }, { status: 401 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userID },
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

    // Delete all related records in a transaction
    await prisma.$transaction(async (prisma) => {
      // Delete QuestionResponses related to student appraisals
      if (user.role === "student") {
        await prisma.questionResponse.deleteMany({
          where: {
            categoryResponse: {
              appraisal: {
                student_id: userID,
              },
            },
          },
        });

        // Delete CategoryResponses
        await prisma.categoryResponse.deleteMany({
          where: {
            appraisal: {
              student_id: userID,
            },
          },
        });

        // Delete StudentAppraisals
        await prisma.studentAppraisal.deleteMany({
          where: {
            student_id: userID,
          },
        });
      }

      // Delete counselor-specific records
      if (user.role === "counselor") {
        // Delete AppraisalTemplate and related records
        const templates = await prisma.appraisalTemplate.findMany({
          where: { counselor_id: userID },
          select: { id: true },
        });

        const templateIds = templates.map((t) => t.id);

        await prisma.questionResponse.deleteMany({
          where: {
            categoryResponse: {
              appraisal: {
                template_id: { in: templateIds },
              },
            },
          },
        });

        await prisma.categoryResponse.deleteMany({
          where: {
            appraisal: {
              template_id: { in: templateIds },
            },
          },
        });

        await prisma.studentAppraisal.deleteMany({
          where: {
            template_id: { in: templateIds },
          },
        });

        await prisma.categoryQuestion.deleteMany({
          where: {
            category: {
              template_id: { in: templateIds },
            },
          },
        });

        await prisma.evaluationCriteria.deleteMany({
          where: {
            template_id: { in: templateIds },
          },
        });

        await prisma.appraisalCategory.deleteMany({
          where: {
            template_id: { in: templateIds },
          },
        });

        await prisma.appraisalTemplate.deleteMany({
          where: {
            counselor_id: userID,
          },
        });
      }

      // Common deletions for all user types
      await prisma.notifications.deleteMany({
        where: { user_id: userID },
      });

      await prisma.user_Resources.deleteMany({
        where: { user_id: userID },
      });

      // Role-specific table deletions
      switch (user.role) {
        case "student":
          await prisma.event_Registration.deleteMany({
            where: { student_id: userID },
          });
          await prisma.appointment_Requests.deleteMany({
            where: { student_id: userID },
          });
          await prisma.appointments.deleteMany({
            where: { student_id: userID },
          });
          await prisma.referrals.deleteMany({
            where: { student_id: userID },
          });
          await prisma.students.delete({
            where: { student_id: userID },
          });
          break;

        case "teacher":
          await prisma.referrals.deleteMany({
            where: { teacher_id: userID },
          });
          await prisma.teachers.delete({
            where: { teacher_id: userID },
          });
          break;

        case "counselor":
          await prisma.referrals.deleteMany({
            where: { counselor_id: userID },
          });
          await prisma.appointments.deleteMany({
            where: { counselor_id: userID },
          });
          await prisma.counselors.delete({
            where: { counselor_id: userID },
          });
          break;
      }

      // Finally, delete the user
      await prisma.users.delete({
        where: { user_id: userID },
      });
    });

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
