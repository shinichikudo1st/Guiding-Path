import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionData } = await getSession();
  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  // Build the OR conditions based on user role
  const roleConditions = [{ user_id: sessionData.id }];

  if (sessionData.role === "student") {
    roleConditions.push({ user_id: "000" });
  }

  if (sessionData.role === "student" || sessionData.role === "teacher") {
    roleConditions.push({ user_id: "001" });
  }

  try {
    const unreadCount = await prisma.notifications.count({
      where: {
        OR: roleConditions,
        isRead: false,
      },
    });

    return NextResponse.json({ unreadCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
