import { model, Schema } from "mongoose";

import { IDoctor } from "../interfaces/doctor.interface";
import { Procedure } from "./procedure.model";

const doctorSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        procedures: [
            { type: Schema.Types.ObjectId, required: true, ref: Procedure },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.createdAt;
                delete ret.updatedAt;
                return ret;
            },
        },
    },
);

export const Doctor = model<IDoctor>("doctor", doctorSchema);
