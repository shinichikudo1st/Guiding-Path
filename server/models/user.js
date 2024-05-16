import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
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
  gradeLevel: {
    type: Number,
    required: function () {
      return this.role === "student";
    },
  },
  program: {
    type: String,
    required: function () {
      return this.role === "student";
    },
  },
  contactInfo: {
    phone: String, // Add more contact fields (address, parent contact, etc.) as needed
  },
});

const User = models.User || model("User", UserSchema);

export default User;
