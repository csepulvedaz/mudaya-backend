import { Schema, model } from "mongoose";

const driverSchema = new Schema(
    {
        _id: { type: Number, required: true },
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
            // match: [
            //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            //     "Please fill a valid email address",
            // ],
        },
        password: {
            type: String,
            required: true,
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

export default model("Driver", driverSchema);
