import mongoose, { Schema } from "mongoose";

const clinicSchema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        procedures: [
            { type: Schema.Types.ObjectId, required: true, ref: "procedure" },
        ],
        doctors: [
            { type: Schema.Types.ObjectId, required: true, ref: "doctor" },
        ],
        description: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

export const Clinic = mongoose.model("clinic", clinicSchema);
