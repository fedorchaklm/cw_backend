import { model, Schema } from "mongoose";

import { IDoctor } from "../interfaces/doctor.interface";
import { Procedure } from "./procedure.model";

const doctorSchema = new Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        // age: { type: Number, required: true },
        // experience: { type: Number, required: true },
        // clinics: [
        //     { type: Schema.Types.ObjectId, required: true, ref: "clinic" },
        // ],
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
