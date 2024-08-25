import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

export async function DELETE(request) {
  const { url } = await request.json();

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    await del(url);

    await prisma.users.update({
      where: {
        user_id: sessionData.id,
      },
      data: {
        profilePicture: null,
      },
    });

    return NextResponse.json({ message: "Deleted Image" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
