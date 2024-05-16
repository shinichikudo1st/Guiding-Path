import { Schema, model, models } from "mongoose";

const resourceSchema = new Schema({});

const Resource = models.Resource || model("Resource", resourceSchema);

export default Resource;
