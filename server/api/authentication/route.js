import User from "@/server/models/user";
import { connectToDB } from "@/server/utils/database";

export const POST = async (request) => {
  try {
    const { email, password } = await request.json();
    await connectToDB();

    const account = await User.findOne({ email });

    // const passwordMatch = await bcrypt.compare( password, account.password); once createUser is done

    if (password === account.password) {
    }

    if (account) {
    }
  } catch (error) {
    console.log(error);
  }
};
