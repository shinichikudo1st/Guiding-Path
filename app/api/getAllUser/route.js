import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

/**
 *
 * fetches all the appointment request based on the page being passed
 *
 * @function getRequests
 *
 * @param {Request} request The incoming request object that includes URL parameters
 * @param {string} request.url URL containing the page query parameter
 * @param {number} page page number passed as a URL parameter
 *
 * @example
 * GET /api/getRequests?page=1
 *
 * @returns {NextResponse} response containing the appointment requests, current page, total pages, and total request count
 *
 */

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const role = url.searchParams.get("role");
  const search = url.searchParams.get("search");
  const pageSize = 10;
  const { sessionData } = await getSession();

  const pageNumber = parseInt(page);
  const limit = parseInt(pageSize);
  const skip = (pageNumber - 1) * limit;

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    let whereClause = {
      status: "active",
    };

    if (role !== "allRoles") {
      whereClause = { ...whereClause, role: role };
    }

    if (search && search.trim() !== "") {
      whereClause = {
        ...whereClause,
        name: { contains: search.trim(), mode: "insensitive" },
      };
    }

    const totalUser = await prisma.users.count({
      where: whereClause,
    });

    let users = await prisma.users.findMany({
      skip,
      take: limit,
      where: whereClause,
      include: {
        student: true,
        counselor: true,
        teacher: true,
      },
    });

    return NextResponse.json(
      {
        users,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalUser / limit),
        totalUser,
      },
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
