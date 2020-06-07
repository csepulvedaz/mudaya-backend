import {model, Schema} from "mongoose";

const rankSchema = new Schema(
    {
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
