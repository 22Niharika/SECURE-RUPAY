import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a Username"],
    },
    password: {
        required: [true, "Please provide a password"],
        type: String,
    },
    currentAmount: {
        type: Number,
        default: 50000,
    },
    totalAmount: {
        type: Number,
        default: 50000,
    },
    history: {
        type: [{
            transactionAmount: Number,
            remark: String,
        }],
        default: [],
    },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);