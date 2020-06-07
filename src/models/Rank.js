import {model, Schema} from "mongoose";

const rankSchema = new Schema(
    {
        _id: { type: String, required: true },
        value: {
            type: Number,
            required: true,
        },
        totalRatings: {
            type: Number,
            required: true,
        },
        idVehicle: {
            type: String,
            ref: "Vehicle",
        },
    },
    {
        versionKey: false,
    }
);

export default model("Rank", rankSchema);
