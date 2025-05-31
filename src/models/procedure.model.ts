import { model, Schema } from "mongoose";

import { IProcedure } from "../interfaces/procedure.interface";

const procedureSchema = new Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

export const Procedure = model<IProcedure>("procedure", procedureSchema);
