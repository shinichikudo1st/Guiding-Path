import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/app/utils/authentication";

/**
 * @description check if date is available for setting appointment if there is an appointment already set then return error else return success
 * @param {NextRequest} request
 * @returns {Promise<NextResponse>}
 */

export async function POST(request) {
  const { sessionData } = await getSession();
  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, id } = await request.json();

  if (!date || !id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const appointmentDate = new Date(date);
  const hours = appointmentDate.getHours();
  const minutes = appointmentDate.getMinutes();
  const dayOfWeek = appointmentDate.getDay();

  //check if date is by hour
  if (minutes !== 0) {
    return NextResponse.json(
      { error: "Date must be by hour" },
      { status: 400 }
    );
  }

  // Check if the date is a weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return NextResponse.json(
      { error: "Weekends are not available for appointments" },
      { status: 400 }
    );
  }

  // Check if the time is within working hours (8 AM - 5 PM, excluding 12 PM - 1 PM)
  const isValidTime =
    (hours === 8 && minutes >= 0) ||
    (hours > 8 && hours < 12) ||
    (hours === 13 && minutes >= 0) ||
    (hours > 13 && hours < 17);

  if (!isValidTime) {
    return NextResponse.json(
      {
        error:
          "Please select a time between 8:00 AM and 5:00 PM, excluding 12:00 PM to 1:00 PM",
      },
      { status: 400 }
    );
  }

  try {
    const existingAppointment = await prisma.appointments.findFirst({
      where: {
        date_time: appointmentDate,
        NOT: {
          appointment_id: id,
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 400 }
      );
    }

    const updatedAppointment = await prisma.appointments.update({
      where: {
        appointment_id: id,
        counselor_id: sessionData.id,
      },
      data: {
        date_time: appointmentDate,
      },
    });

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: "Failed to update appointment" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Appointment schedule updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the appointment" },
      { status: 500 }
    );
  }
}
