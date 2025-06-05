/*eslint-disable no-console */

// import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { config } from "../configs/config";
// import { RoleEnum } from "../enums/role.enum";
import { Clinic } from "../models/clinic.model";
import { Doctor } from "../models/doctor.model";
import { Procedure } from "../models/procedure.model";
// import { User } from "../models/user.model";

dotenv.config();

async function seed2() {
    try {
        await mongoose.connect(config.MONGO_URI);

        // await mongoose.connection.db.dropDatabase();

        // const password = await bcrypt.hash("P@ssword123", 10);

        // await User.insertMany([
        //     {
        //         name: "Admin",
        //         surname: "Admin",
        //         email: "admin@gmail.com",
        //         password,
        //         isActive: "true",
        //         role: RoleEnum.ADMIN,
        //     },
        //     {
        //         name: "Mary",
        //         surname: "Smith",
        //         email: "mary_smith@gmail.com",
        //         password,
        //         isActive: "true",
        //         role: RoleEnum.USER,
        //     },
        //     {
        //         name: "John",
        //         surname: "Smith",
        //         email: "jogn_smith@gmail.com",
        //         password,
        //         isActive: "true",
        //         role: RoleEnum.USER,
        //     },
        //     {
        //         name: "Max",
        //         surname: "Ivanov",
        //         email: "ivanov@gmail.com",
        //         password,
        //         isActive: "true",
        //         role: RoleEnum.USER,
        //     },
        //     {
        //         name: "Patrick",
        //         surname: "Sponge",
        //         email: "sponge@gmail.com",
        //         password,
        //         isActive: "true",
        //         role: RoleEnum.USER,
        //     },
        // ]);

        const procedures = await Procedure.insertMany([
            { name: "General Medical Consultation" },
            { name: "Dermatology Skin Check" },
            { name: "Cardiac Stress Test" },
            { name: "Electrocardiogram" },
            { name: "Ultrasound Examination" },
            { name: "Pap Smear Test" },
            { name: "Prenatal Care" },
            { name: "Vaccination" },
            { name: "Physical Therapy Session" },
            { name: "Allergy Testing" },
            { name: "Blood Pressure Monitoring" },
            { name: "Cholesterol Screening" },
            { name: "Diabetes Management" },
            { name: "ENT Examination" },
            { name: "Vision Test" },
            { name: "Glaucoma Screening" },
            { name: "Skin Allergy Treatment" },
            { name: "Minor Surgery" },
            { name: "X-Ray Imaging" },
            { name: "MRI Scan" },
            { name: "CT Scan" },
            { name: "Family Planning Consultation" },
            { name: "Nutritional Counseling" },
            { name: "Psychological Therapy Session" },
            { name: "Occupational Therapy" },
            { name: "Wound Care" },
            { name: "Sports Injury Assessment" },
            { name: "Prostate Exam" },
            { name: "STD Testing" },
            { name: "Immunotherapy for Allergies" },
        ]);
        console.log({ procedures });
        // Create doctors with procedures
        const doctors = await Doctor.insertMany([
            {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@gmail.com",
                phone: "0990000001",
                procedures: [procedures[0]._id, procedures[1]._id],
            },
            {
                firstName: "Alice",
                lastName: "Lee",
                email: "alice.lee@gmail.com",
                phone: "0990000002",
                procedures: [procedures[1]._id],
            },
            {
                firstName: "Michael",
                lastName: "Smith",
                email: "michael.smith@gmail.com",
                phone: "0990000003",
                procedures: [procedures[3]._id, procedures[4]._id],
            },
            {
                firstName: "Sarah",
                lastName: "Johnson",
                email: "sarah.johnson@gmail.com",
                phone: "0990000004",
                procedures: [procedures[4]._id, procedures[5]._id],
            },
            {
                firstName: "Robert",
                lastName: "Brown",
                email: "robert.brown@gmail.com",
                phone: "0990000005",
                procedures: [procedures[5]._id],
            },
            {
                firstName: "Emily",
                lastName: "Davis",
                email: "emily.davis@gmail.com",
                phone: "0990000006",
                procedures: [procedures[6]._id, procedures[7]._id],
            },
            {
                firstName: "William",
                lastName: "Wilson",
                email: "william.wilson@gmail.com",
                phone: "0990000007",
                procedures: [
                    procedures[6]._id,
                    procedures[5]._id,
                    procedures[8]._id,
                ],
            },
            {
                firstName: "Olivia",
                lastName: "Taylor",
                email: "olivia.taylor@gmail.com",
                phone: "0990000008",
                procedures: [procedures[6]._id, procedures[7]._id],
            },
            {
                firstName: "David",
                lastName: "Anderson",
                email: "david.anderson@gmail.com",
                phone: "0990000009",
                procedures: [procedures[8]._id],
            },
            {
                firstName: "Sophia",
                lastName: "Martinez",
                email: "sophia.martinez@gmail.com",
                phone: "0990000010",
                procedures: [
                    procedures[8]._id,
                    procedures[9]._id,
                    procedures[10]._id,
                ],
            },
            {
                firstName: "James",
                lastName: "Thomas",
                email: "james.thomas@gmail.com",
                phone: "0990000011",
                procedures: [procedures[9]._id],
            },
            {
                firstName: "Grace",
                lastName: "Moore",
                email: "grace.moore@gmail.com",
                phone: "0990000012",
                procedures: [procedures[9]._id, procedures[5]._id],
            },
            {
                firstName: "Daniel",
                lastName: "Jackson",
                email: "daniel.jackson@gmail.com",
                phone: "0990000013",
                procedures: [procedures[4]._id],
            },
            {
                firstName: "Chloe",
                lastName: "White",
                email: "chloe.white@gmail.com",
                phone: "0990000014",
                procedures: [procedures[10]._id, procedures[12]._id],
            },
            {
                firstName: "Matthew",
                lastName: "Harris",
                email: "matthew.harris@gmail.com",
                phone: "0990000015",
                procedures: [procedures[14]._id],
            },
            {
                firstName: "Ella",
                lastName: "Martin",
                email: "ella.martin@gmail.com",
                phone: "0990000016",
                procedures: [procedures[13]._id, procedures[4]._id],
            },
            {
                firstName: "Joseph",
                lastName: "Thompson",
                email: "joseph.thompson@gmail.com",
                phone: "0990000017",
                procedures: [procedures[14]._id],
            },
            {
                firstName: "Lily",
                lastName: "Garcia",
                email: "lily.garcia@gmail.com",
                phone: "0990000018",
                procedures: [procedures[8]._id, procedures[5]._id],
            },
            {
                firstName: "Christopher",
                lastName: "Martinez",
                email: "christopher.martinez@gmail.com",
                phone: "0990000019",
                procedures: [procedures[15]._id],
            },
            {
                firstName: "Ava",
                lastName: "Clark",
                email: "ava.clark@gmail.com",
                phone: "0990000020",
                procedures: [procedures[16]._id, procedures[17]._id],
            },
        ]);

        await Clinic.insertMany([
            {
                name: "Smile Dental Clinic",
                doctors: [doctors[0]._id, doctors[1]._id],
            },
            {
                name: "BrightCare Medical Center",
                doctors: [doctors[2]._id, doctors[3]._id],
            },
            {
                name: "Wellness Health Clinic",
                doctors: [doctors[4]._id, doctors[5]._id],
            },
            {
                name: "Healthy Life Clinic",
                doctors: [doctors[6]._id, doctors[7]._id],
            },
            {
                name: "Sunshine Family Clinic",
                doctors: [doctors[8]._id, doctors[9]._id],
            },
            {
                name: "Downtown Medical Group",
                doctors: [doctors[10]._id, doctors[11]._id],
            },
            {
                name: "Evergreen Clinic",
                doctors: [doctors[12]._id, doctors[13]._id],
            },
            {
                name: "CarePlus Health Center",
                doctors: [doctors[14]._id, doctors[15]._id],
            },
            {
                name: "Harmony Wellness Clinic",
                doctors: [doctors[16]._id, doctors[17]._id],
            },
            {
                name: "Green Valley Clinic",
                doctors: [doctors[18]._id, doctors[19]._id],
            },
        ]);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed2();
