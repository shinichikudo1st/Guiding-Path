import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import moment from "moment-timezone";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestAppointmentSchema = z.object({
  grade: z.string().min(1),
  reason: z.string().min(1),
  urgency: z.string().min(1),
  contact: z.string().min(1),
  notes: z.string().min(1),
});

/**
 *
 * @description Submit Request Appointment API Route
 * @param   {Request} request
 * @returns {Promise<NextResponse>}
 */

export async function POST(request) {
  try {
    const body = await request.json();

    const { grade, reason, urgency, contact, notes } =
      requestAppointmentSchema.parse(body);

    const { sessionData } = await getSession();

    if (!sessionData) {
      return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
    }

    const date = moment().tz("Asia/Manila");

    await Promise.all([
      prisma.appointment_Requests.create({
        data: {
          student_id: sessionData.id,
          name: sessionData.name,
          grade: grade,
          reason: reason,
          urgency: urgency,
          contact: contact,
          notes: notes,
          type: "inperson",
          role: sessionData.role,
          request_date: date.toDate(),
        },
      }),
      prisma.notifications.create({
        data: {
          user_id: "332570",
          title: "New Appointment Request",
          content: "You have a new appointment request",
          date: date.toDate(),
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Appointment Request Submitted" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
