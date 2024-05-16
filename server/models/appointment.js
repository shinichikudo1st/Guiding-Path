import { Schema, model, models } from "mongoose";

const appointmentSchema = new Schema({});

const Appointment =
  models.Appointment || model("Appointment", appointmentSchema);

export default Appointment;
