import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionData } = await getSession();
  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const unreadCount = await prisma.notifications.count({
      where: {
        OR: [{ user_id: sessionData.id }, { user_id: "000" }],
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
