import { getSession } from "@/app/utils/authentication";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json(
      { message: "Unauthorized Session" },
      { status: 401 }
    );
  }

  try {
    const count = await prisma.Appointments.count({
      where: {
        date_time: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    return NextResponse.json({ count: count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
