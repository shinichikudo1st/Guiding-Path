import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { sessionData } = await getSession();
    if (!sessionData) {
      return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const events = await prisma.events.findMany({
      skip,
      take: pageSize,
    });
    const totalEvents = await prisma.events.count();
    const totalPages = Math.ceil(totalEvents / pageSize);
    return NextResponse.json(
      { events, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
