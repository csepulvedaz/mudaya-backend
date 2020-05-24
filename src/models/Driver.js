import { Schema, model } from "mongoose";

const driverSchema = new Schema(
    {
        _id: { type: String, required: true },
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        idVehicle: {
            type: [String],
            ref: "Vehicle",
        },
        idService: {
            type: [Schema.Types.ObjectId],
            ref: "Service",
        },
        lastLogout: {
            type: Date,
        },
    },
    {
        versionKey: false,
    }
);

export default model("Driver", driverSchema);
