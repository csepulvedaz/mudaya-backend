import { Schema, model } from "mongoose";

const vehicleSchema = new Schema(
    {
        _id: { type: String, required: true },
        brand: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        dimensions: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        commentary: {
            type: String,
            required: true,
        },
        idDriver: {
            type: Number,
            ref: "Driver",
        },
    },
    {
        versionKey: false,
    }
);

export default model("Vehicle", vehicleSchema);
