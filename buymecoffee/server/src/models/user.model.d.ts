import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";
export interface IUserMethods {
    comparePassword(candidate: string): Promise<boolean>;
}
export interface Iuser extends Document, IUserMethods {
    username: string;
    name: string;
    bio: string;
    email: string;
    password: string;
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserModel: mongoose.Model<Iuser, {}, {}, {
    id: string;
}, Document<unknown, {}, Iuser, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, Schema<Iuser, mongoose.Model<Iuser, any, any, any, any, any, Iuser>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Iuser, Document<unknown, {}, Iuser, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Iuser, Document<unknown, {}, Iuser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>>;
    comparePassword?: mongoose.SchemaDefinitionProperty<(candidate: string) => Promise<boolean>, Iuser, Document<unknown, {}, Iuser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>>;
    username?: mongoose.SchemaDefinitionProperty<string, Iuser, Document<unknown, {}, Iuser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>>;
    name?: mongoose.SchemaDefinitionProperty<string, Iuser, Document<unknown, {}, Iuser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>>;
    bio?: mongoose.SchemaDefinitionProperty<string, Iuser, Document<unknown, {}, Iuser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>>;
    email?: mongoose.SchemaDefinitionProperty<string, Iuser, Document<unknown, {}, Iuser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>>;
    password?: mongoose.SchemaDefinitionProperty<string, Iuser, Document<unknown, {}, Iuser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>>;
    avatarUrl?: mongoose.SchemaDefinitionProperty<string, Iuser, Document<unknown, {}, Iuser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdAt?: mongoose.SchemaDefinitionProperty<Date, Iuser, Document<unknown, {}, Iuser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>>;
    updatedAt?: mongoose.SchemaDefinitionProperty<Date, Iuser, Document<unknown, {}, Iuser, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Iuser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Iuser>, Iuser>;
//# sourceMappingURL=user.model.d.ts.map