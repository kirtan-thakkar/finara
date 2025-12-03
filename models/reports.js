import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    period: {
      type: String,
      required: true,
    },

    sentDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["SENT", "PENDING", "FAILED", "NO_ACTIVITY"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Report =
  mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
