import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["INCOME", "EXPENSE"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    receiptUrl: {
      type: String,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurringInterval: {
      type: String,
      enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
      default: null,
    },

    nextRecurringDate: {
      type: Date,
      default: null,
    },

    lastProcessed: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "COMPLETED",
    },

    
    paymentMethod: {
      type: String,
      enum: ["CARD", "BANK_TRANSFER", "MOBILE_PAYMENT", "AUTO_DEBIT", "CASH", "OTHER"],
      default: "CASH",
    },
  },
  {
    timestamps: true, 
  }
);

const Transactions =
  mongoose.models.Transactions ||
  mongoose.model("Transactions", transactionSchema);

export { Transactions };
