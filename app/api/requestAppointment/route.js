import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, grade, reason, urgency, contact, notes } = await request.json();

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
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
    await prisma.appointment_Requests.create({
      data: {
        student_id: sessionData.id,
        name: name,
        grade: grade,
        reason: reason,
        urgency: urgency,
        contact: contact,
        notes: notes,
        role: sessionData.role,
        request_date: currentDate,
      },
    });

    return NextResponse.json(
      { message: "Appointment Request Submitted" },
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
