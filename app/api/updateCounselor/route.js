import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

const isEmpty = (obj) => Object.keys(obj).length === 0;

export async function POST(request) {
  const { name, department, contact } = await request.json();

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  const updateData = {};

  if (name !== "") {
    updateData.name = name;
  }

  if (contact !== "") {
    updateData.contact = contact;
  }

  const counselorData = {};

  if (department !== "") {
    counselorData.department = department;
  }

  try {
    if (!isEmpty(updateData)) {
      await prisma.users.update({
        where: {
          user_id: sessionData.id,
        },
        data: {
          ...updateData,
        },
      });
    }

    if (!isEmpty(counselorData)) {
      await prisma.counselors.update({
        where: {
          counselor_id: sessionData.id,
        },
        data: {
          ...counselorData,
        },
      });
    }

    return NextResponse.json({ message: "User Updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
