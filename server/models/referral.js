import { Schema, model, models } from "mongoose";

const referralSchema = new Schema({});

const Referral = models.Referral || model("Referral", referralSchema);

export default Referral;
