import { Schema, model, models } from "mongoose";

const UserSchema = newSchema({
  lastname: {
    type: String,
    required: [true, "Last Name is required"],
  },
  firstname: {
    type: String,
    required: [true, "First Name is required"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
  },
  hashedPassword: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
  },
  status: {
    type: Boolean,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
