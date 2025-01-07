import { getSession } from "@/app/utils/authentication";
import moment from "moment-timezone";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { resourceID } = await request.json();
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingResource = await prisma.user_Resources.findFirst({
      where: {
        user_id: sessionData.id,
        resource_id: resourceID,
      },
    });

    if (!existingResource) {
      await prisma.user_Resources.create({
        data: {
          user_id: sessionData.id,
          resource_id: resourceID,
          access_date: moment().tz("Asia/Manila").toDate(),
        },
      });
    }

    return NextResponse.json(
      { message: "Resource created successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
