import mongoose, { Document, Types } from "mongoose";
const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tokenHash: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
export const SessionModel = mongoose.model("Session", sessionSchema);
//# sourceMappingURL=session.model.js.map