import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(request) {
  const { role, id, counselorPassword } = await request.json();
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the user and their current role
    const user = await prisma.users.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Start a transaction to handle all database operations
    await prisma.$transaction(async (prisma) => {
      // Delete records from current role-specific tables
      switch (user.role) {
        case "student":
          // Delete student-specific records (similar to deleteUser.js)
          await prisma.questionResponse.deleteMany({
            where: {
              categoryResponse: {
                appraisal: {
                  student_id: id,
                },
              },
            },
          });
          await prisma.categoryResponse.deleteMany({
            where: {
              appraisal: {
                student_id: id,
              },
            },
          });
          await prisma.studentAppraisal.deleteMany({
            where: { student_id: id },
          });
          await prisma.event_Registration.deleteMany({
            where: { student_id: id },
          });
          await prisma.appointment_Requests.deleteMany({
            where: { student_id: id },
          });
          await prisma.appointments.deleteMany({
            where: { student_id: id },
          });
          await prisma.referrals.deleteMany({
            where: { student_id: id },
          });
          await prisma.students.delete({
            where: { student_id: id },
          });
          break;

        case "teacher":
          await prisma.referrals.deleteMany({
            where: { teacher_id: id },
          });
          await prisma.teachers.delete({
            where: { teacher_id: id },
          });
          break;

        case "counselor":
          // Handle counselor-specific deletions
          const templates = await prisma.appraisalTemplate.findMany({
            where: { counselor_id: id },
            select: { id: true },
          });
          const templateIds = templates.map((t) => t.id);

          // Delete all related appraisal records
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
            where: { counselor_id: id },
          });
          await prisma.referrals.deleteMany({
            where: { counselor_id: id },
          });
          await prisma.appointments.deleteMany({
            where: { counselor_id: id },
          });
          await prisma.counselors.delete({
            where: { counselor_id: id },
          });
          break;
      }

      // Update user role
      await prisma.users.update({
        where: { user_id: id },
        data: { role },
      });

      // Create new role-specific record
      switch (role) {
        case "student":
          await Promise.all([
            prisma.students.create({
              data: {
                student_id: id,
              },
            }),

            prisma.notifications.create({
              data: {
                user_id: id,
                title: "Role Update",
                content: "You have been assigned as a student.",
                date: new Date(),
              },
            }),
          ]);
          break;
        case "teacher":
          await Promise.all([
            prisma.teachers.create({
              data: {
                teacher_id: id,
                department: "General", // Default department
              },
            }),

            prisma.notifications.create({
              data: {
                user_id: id,
                title: "Role Update",
                content: "You have been assigned as a teacher.",
                date: new Date(),
              },
            }),
          ]);

          break;
        case "counselor":
          await Promise.all([
            prisma.counselors.create({
              data: {
                counselor_id: id,
                department: "General", // Default department
              },
            }),

            prisma.notifications.create({
              data: {
                user_id: id,
                title: "Role Update",
                content: "You have been assigned as a counselor.",
                date: new Date(),
              },
            }),
          ]);
          break;
      }
    });

    return NextResponse.json(
      { message: "Role updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Modify user error:", error);
    return NextResponse.json(
      { message: "Failed to update role" },
      { status: 500 }
    );
  }
}
