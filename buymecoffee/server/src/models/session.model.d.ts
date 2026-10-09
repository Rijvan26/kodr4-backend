import mongoose, { Document, Types } from "mongoose";
export interface ISession extends Document {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const SessionModel: mongoose.Model<ISession, {}, {}, {}, Document<unknown, {}, ISession, {}, mongoose.DefaultSchemaOptions> & ISession & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISession>;
//# sourceMappingURL=session.model.d.ts.map