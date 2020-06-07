import { Schema, model } from "mongoose";

const userSchema = new Schema(
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
      // match: [
      //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      //     "Please fill a valid email address",
      // ],
    },
    password: {
      type: String,
      required: true,
    },
    idService: {
      type: [Schema.Types.ObjectId],
      ref: "Service",
    },
    lastLogout: {
      type: Date,
    },
    complains: {
      type: [String],
    },
  },
  {
    versionKey: false,
  }
);

export default model("User", userSchema);
