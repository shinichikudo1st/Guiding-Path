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
  const { date, id, role, notes, reason, counsel_type, referral_id } =
    await request.json();
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
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
    // Conditionally create Promise.all array based on role
    const queries = [
      prisma.appointments.findFirst({
        where: {
          date_time: appointmentDate,
        },
      }),
    ];

    // Only add referral query if role is teacher
    if (role === "teacher") {
      queries.push(
        prisma.referrals.findUnique({
          where: {
            referral_id: referral_id,
          },
          select: {
            teacher_id: true,
            teacher: {
              select: {
                teacher: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        })
      );
    }

    const results = await Promise.all(queries);
    const existingAppointment = results[0];
    const referralTeacher = role === "teacher" ? results[1] : null;

    let submitType, title, content;

    if (role === "student") {
      submitType = "self-appoint";
      title = "Appointment Request";
      content = "Your appointment request has been accepted";
    } else if (role === "teacher") {
      submitType = "referral";
      title = "Referred Appointment";
      content = `You have been referred by ${referralTeacher.teacher.teacher.name} for a counseling appointment`;
    }

    if (existingAppointment) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 400 }
      );
    }

    const [appointment] = await Promise.all([
      prisma.appointments.create({
        data: {
          student_id: id,
          counselor_id: sessionData.id,
          date_time: appointmentDate,
          type: submitType,
          notes: notes,
          reason: reason,
          counsel_type: counsel_type,
          status: "pending",
        },
      }),
      prisma.notifications.create({
        data: {
          user_id: id,
          title: title,
          content: content,
          date: appointmentDate,
        },
      }),
    ]);

    if (role === "teacher") {
      await Promise.all([
        prisma.notifications.create({
          data: {
            user_id: referralTeacher.teacher_id,
            title: "Referral Request Accepted",
            content: "Your referral request has been accepted",
            date: appointmentDate,
          },
        }),
        prisma.referrals.update({
          where: {
            referral_id: referral_id,
          },
          data: {
            status: "confirmed",
            appointment_id: appointment.appointment_id,
          },
        }),
      ]);
    }

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
