import {model, Schema} from "mongoose";

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
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        commentary: {
            type: String,
        },
        idDriver: {
            type: String,
            ref: "Driver",
        },
    },
    {
        versionKey: false,
    }
);

export default model("Vehicle", vehicleSchema);
