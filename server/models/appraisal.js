import { Schema, model, models } from "mongoose";

const appraisalSchema = new Schema({});

const Appraisal = models.Appraisal || model("Appraisal", appraisalSchema);

export default Appraisal;
