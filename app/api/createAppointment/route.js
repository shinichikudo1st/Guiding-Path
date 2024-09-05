import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { id, role, notes } = await request.json();
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  let submitType;

  if (role === "student") {
    submitType = "self-appoint";
  } else if (role === "teacher") {
    submitType = "referral";
  }

  const date = new Date();
  const formattedDate = date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const currentDate = String(formattedDate);

  try {
    await prisma.appointments.create({
      data: {
        student_id: id,
        counselor_id: sessionData.id,
        date_time: currentDate,
        type: submitType,
        notes: notes,
        status: "pending",
      },
    });

    return NextResponse.json(
      { message: "Appointment Created" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
