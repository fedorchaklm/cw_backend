import mongoose, { Schema } from "mongoose";

import { Doctor } from "./doctor.model";

const clinicSchema = new Schema(
    {
        name: { type: String, required: true },
        // address: { type: String, required: true },
        // phone: { type: String, required: true },
        // email: { type: String, required: true },
        // procedures: [
        //     { type: Schema.Types.ObjectId, required: true, ref: "procedure" },
        // ],
        // description: { type: String, required: true },
        doctors: [{ type: Schema.Types.ObjectId, required: true, ref: Doctor }],
    },
    { timestamps: true, versionKey: false },
);

export const Clinic = mongoose.model("clinic", clinicSchema);
