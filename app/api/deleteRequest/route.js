import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const url = new URL(request.url);
  const request_id = parseInt(url.searchParams.get("id"));

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    await prisma.appointment_Requests.delete({
      where: {
        request_id: request_id,
      },
    });

    return NextResponse.json({ message: "Deleted Request" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server" }, { status: 500 });
  }
}
