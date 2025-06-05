import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { config } from "../configs/config";
import { RoleEnum } from "../enums/role.enum";
import { Procedure } from "../models/procedure.model";
import { User } from "../models/user.model";

dotenv.config();

async function seed() {
    try {
        await mongoose.connect(config.MONGO_URI);
        // await mongoose.connection.db.dropDatabase();
        const password = await bcrypt.hash("P@ssword123", 10);
        await User.insertMany([
            {
                name: "Mary",
                surname: "Smith",
                email: "mary_smith@clinic.com",
                password,
                role: RoleEnum.USER,
            },
            {
                name: "John",
                surname: "Smith",
                email: "jogh@clinic.com",
                password,
                role: RoleEnum.USER,
            },
        ]);
        await Procedure.insertMany([
            { name: "Teeth Cleaning" },
            { name: "Tooth Extraction" },
            { name: "Heart Disease Consultation" },
            { name: "Hypertension Treatment" },
            { name: "Psychotherapy Session" },
        ]);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
