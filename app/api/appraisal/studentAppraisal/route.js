import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { sessionData } = await getSession();

  if (!sessionData || sessionData.role !== "counselor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    // Get students with their appraisal data
    const students = await prisma.students.findMany({
      where: {
        student: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
            profilePicture: true,
          },
        },
        appraisals: {
          include: {
            template: {
              select: {
                title: true,
                description: true,
              },
            },
            categoryResponses: {
              include: {
                category: true,
                questionResponses: {
                  include: {
                    question: true,
                  },
                },
              },
            },
          },
        },
      },
      skip,
      take: limit,
    });

    const totalStudents = await prisma.students.count({
      where: {
        student: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      },
    });

    return NextResponse.json({
      students,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching student appraisals:", error);
    return NextResponse.json(
      { message: "Error fetching student appraisals" },
      { status: 500 }
    );
  }
}
