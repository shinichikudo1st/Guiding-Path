import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";

export async function DELETE(request) {
  const { password, userID } = await request.json();

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const counselor = await prisma.users.findUnique({
    where: {
      user_id: sessionData.id,
    },
  });

  const match = await bcrypt.compare(password, counselor.password);

  if (!match) {
    return NextResponse.json({ message: "Wrong password" }, { status: 401 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        user_id: userID,
      },
    });

    if (user.role === "teacher") {
      await Promise.all([
        prisma.notifications.deleteMany({
          where: { user_id: userID },
        }),
        prisma.users.delete({
          where: { user_id: userID },
        }),
        prisma.teachers.delete({
          where: { teacher_id: userID },
        }),
        prisma.referrals.deleteMany({
          where: { teacher_id: userID },
        }),
      ]);
    } else if (user.role === "student") {
      await Promise.all([
        prisma.notifications.deleteMany({
          where: { user_id: userID },
        }),
        prisma.users.delete({
          where: { user_id: userID },
        }),
        prisma.students.delete({
          where: { student_id: userID },
        }),
        prisma.event_Registrations.deleteMany({
          where: { student_id: userID },
        }),
        prisma.referrals.deleteMany({
          where: { student_id: userID },
        }),
        prisma.appointments.deleteMany({
          where: { student_id: userID },
        }),
        prisma.evaluation_Trends.delete({
          where: { student_id: userID },
        }),
        prisma.appraisals.deleteMany({
          where: { student_id: userID },
        }),
        prisma.appointment_Requests.deleteMany({
          where: { student_id: userID },
        }),
      ]);
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
