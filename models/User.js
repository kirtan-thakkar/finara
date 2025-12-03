import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    name: {
        required: true,
        type: String,
        trim: true,
    },
    currency: {
        enum: ["INR", "USD"],
        type: String,
        default: "INR"
    },

    monthlyBudget: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export { User };
