import mongoose, { Document, Types } from "mongoose";

export interface ISession extends Document {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new mongoose.Schema<ISession>(
    {
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
    },
    {
        timestamps: true,
    }
);

export const SessionModel = mongoose.model<ISession>(
    "Session",
    sessionSchema
);