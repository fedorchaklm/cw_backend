import { model, Schema } from "mongoose";

import { IDoctor } from "../interfaces/doctor.interface";

const doctorSchema = new Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        age: { type: Number, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        specialty: { type: String, required: true },
        experience: { type: Number, required: true },
        clinics: [
            { type: Schema.Types.ObjectId, required: true, ref: "clinic" },
        ],
        procedures: [
            { type: Schema.Types.ObjectId, required: true, ref: "procedure" },
        ],
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false },
);

export const Doctor = model<IDoctor>("doctor", doctorSchema);
