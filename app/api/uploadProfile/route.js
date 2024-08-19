import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  const blob = await put(filename, request.body, { access: "public" });

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    await prisma.users.update({
      where: {
        user_id: sessionData.id,
      },
      data: {
        profilePicture: blob.url,
      },
    });

    return NextResponse.json(
      { message: "Image Uploaded", blob: blob },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
