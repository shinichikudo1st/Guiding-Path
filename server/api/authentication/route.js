import User from "@/server/models/user";
import { connectToDB } from "@/server/utils/database";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const { email, password } = await request.json();
    await connectToDB();

    const account = await User.findOne({ email });

    // const passwordMatch = await bcrypt.compare( password, account.password); once createUser is done

    if(!account) {
      return NextResponse("")
    }

    if(password === account.password) {
    }

    
  } catch (error) {
    console.log(error);
  }
};
