import { Schema, model } from "mongoose";
import dayjs from "dayjs";

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
        dayjs(
          new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
        ).format(),
    },
  }
);

export default model("Service", serviceSchema);
