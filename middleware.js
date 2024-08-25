import { NextResponse } from "next/server";
import { getSession } from "./app/utils/authentication";

export async function middleware(request) {
  const authorized = await getSession();

  if (!authorized) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pages/adminDashboard"],
};
