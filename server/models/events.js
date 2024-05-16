import { Schema, model, models } from "mongoose";

const eventSchema = new Schema({});

const Event = models.Event || model("Event", eventSchema);

export default Event;
