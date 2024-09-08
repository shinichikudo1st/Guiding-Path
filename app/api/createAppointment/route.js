import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

/**
 *
 * @function AppointmentHandler create new appointment record in the database after accepting appointment request
 *
 * @param {Request} request request object with a JSON body containing id, role, notes
 * @param {Object} request.body JSON body of the request
 * @param {string} request.body.id student id
 * @param {string} request.body.role role of user eg: student, counselor, teacher
 * @param {string} request.body.notes additional information in the appointment request to support the reason of request
 *
 * @returns {NextResponse}
 */

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

  try {
    await prisma.appointments.create({
      data: {
        student_id: id,
        counselor_id: sessionData.id,
        date_time: date,
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
