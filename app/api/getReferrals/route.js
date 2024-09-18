import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

/**
 * @function GET Retrieves all referrals from the database
 * @returns {NextResponse}
 */
export async function GET() {
  const { sessionData } = await getSession();

  if (
    !sessionData ||
    !["teacher", "counselor", "admin"].includes(sessionData.role)
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const referrals = await prisma.referrals.findMany({
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

    return NextResponse.json(referrals, { status: 200 });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json(
      { message: "Error fetching referrals" },
      { status: 500 }
    );
  }
}
