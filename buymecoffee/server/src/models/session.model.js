import mongoose, { Document, Types } from "mongoose";
import crypto from "crypto";
// 2. Pass the interface into the Schema
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
        default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    },
}, { timestamps: true });
// 3. Document Hook (for SessionModel.create() or session.save())
sessionSchema.pre("save", function () {
    // 'this' is strongly typed as the document here
    if (this.isModified("tokenHash")) {
        this.tokenHash = crypto
            .createHash("sha512")
            .update(this.tokenHash)
            .digest("hex");
    }
});
// 4. Query Hook (for SessionModel.findOneAndUpdate())
sessionSchema.pre("findOneAndUpdate", function () {
    // 'this' is strongly typed as the query here
    const update = this.getUpdate();
    if (!update)
        return;
    // Check if tokenHash is being set directly (e.g., { tokenHash: "..." })
    if (update.tokenHash && typeof update.tokenHash === "string") {
        update.tokenHash = crypto
            .createHash("sha512")
            .update(update.tokenHash)
            .digest("hex");
    }
    // Check if tokenHash is being set via $set (e.g., { $set: { tokenHash: "..." } })
    else if (update.$set && update.$set.tokenHash && typeof update.$set.tokenHash === "string") {
        update.$set.tokenHash = crypto
            .createHash("sha512")
            .update(update.$set.tokenHash)
            .digest("hex");
    }
});
// 5. Export the typed model
export const SessionModel = mongoose.model("Session", sessionSchema);
//# sourceMappingURL=session.model.js.map