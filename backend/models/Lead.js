import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    message: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      default: "website",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },

    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;