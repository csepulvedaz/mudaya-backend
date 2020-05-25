import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
    {
        createdAt: Date,
        updatedAt: Date,
        date: {
            type: Date,
            required: true,
        },
        origin: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        commentaryUser: {
            type: String,
        },
        commentaryDriver: {
            type: String,
        },
        state: {
            type: String,
        },
        price: {
            type: String,
        },
        idUser: {
            type: String,
            required: true,
            ref: "User",
        },
        idDriver: {
            type: String,
            ref: "Driver",
        },
        idVehicle: {
            type: String,
            ref: "Vehicle",
        },
    },
    {
        versionKey: false,
        timestamps: {
            currentTime: () =>
                new Date(new Date().getTime() - 3600 * 1000 * 5).toISOString(),
        },
    }
);

export default model("Service", serviceSchema);
