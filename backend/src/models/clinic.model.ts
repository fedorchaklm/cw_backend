import mongoose, { Schema } from "mongoose";

import { Doctor } from "./doctor.model";

const clinicSchema = new Schema(
    {
        name: { type: String, required: true },
        doctors: [{ type: Schema.Types.ObjectId, required: true, ref: Doctor }],
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

export const Clinic = mongoose.model("clinic", clinicSchema);
