import User from "@/server/models/user";
import { connectDB } from "@/server/utils/database";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    console.log({ email, password });

    const userExists = await User.findOne({ email });

    return;
  } catch (error) {}
}
