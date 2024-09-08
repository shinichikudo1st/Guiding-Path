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
  const pageSize = 5;
  const { sessionData } = await getSession();

  const pageNumber = parseInt(page);
  const limit = parseInt(pageSize);
  const skip = (pageNumber - 1) * limit;

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const totalRequest = await prisma.appointment_Requests.count();
    let requests = await prisma.appointment_Requests.findMany({
      skip,
      take: limit,
      include: {
        student: {
          include: {
            student: {
              select: {
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        requests,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRequest / limit),
        totalRequest,
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
