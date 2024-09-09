import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const appointments = await prisma.appointments.findMany({
      where: {
        status: "pending",
      },
      include: {
        counselor: {
          include: {
            counselor: {
              select: {
                name: true,
                contact: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Retrieved Appointments", appointment: appointments },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
