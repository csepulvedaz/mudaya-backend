import {model, Schema} from "mongoose";

const ratingSchema = new Schema(
    {
        _id: { type: String, required: true },
        value: {
            type: Number,
            required: true,
        },
        commentary: {
            type: String,
            required: false,
        },
        idDriver: {
            type: String,
            ref: "Driver",
        },
        idVehicle: {
            type: String,
            ref: "Vehicle",
        },
        idService: {
            type: [Schema.Types.ObjectId],
            ref: "Service",
        },
    },
    {
        versionKey: false,
    }
);

export default model("Rating", ratingSchema);
