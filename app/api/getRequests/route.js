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
    const requests = await prisma.appointment_Requests.findMany({
      skip,
      take: limit,
      orderBy: {
        request_date: "asc", // Default ordering by date
      },
      include: {
        student: {
          select: {
            student: {
              select: {
                profilePicture: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Custom sorting to prioritize "very" urgent requests
    const sortedRequests = requests.sort((a, b) => {
      if (a.urgency === "very" && b.urgency !== "very") return -1;
      if (a.urgency !== "very" && b.urgency === "very") return 1;
      // If neither or both are "very", maintain the original date-based order
      return 0;
    });

    // Format dates for display
    const formattedRequests = sortedRequests.map((request) => {
      const date = new Date(request.request_date);
      const formattedDate = date.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      return {
        ...request,
        request_date: formattedDate,
      };
    });

    return NextResponse.json(
      {
        requests: formattedRequests,
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
