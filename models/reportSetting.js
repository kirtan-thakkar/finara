import mongoose from "mongoose";

const reportSettingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    frequency: {
      type: String,
      enum: ["MONTHLY"],
      default: "MONTHLY",
    },

    isEnabled: {
      type: Boolean,
      default: false,
    },

    nextReportDate: {
      type: Date,
      default: null,
    },

    lastSentDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const ReportSetting =
  mongoose.models.ReportSetting ||
  mongoose.model("ReportSetting", reportSettingSchema);

export default ReportSetting;
