import { FilterQuery } from "mongoose";

import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorQuery,
} from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";

class DoctorRepository {
    public getAll = (
        query: IDoctorQuery,
    ): Promise<[Array<IDoctor>, number]> => {
        const filterObject: FilterQuery<IDoctor> = {};
        const skip = query.pageSize * (query.page - 1);

        if (query.firstName) {
            filterObject.firstName = { $regex: query.firstName, $options: "i" };
        }
        if (query.lastName) {
            filterObject.lastName = { $regex: query.lastName, $options: "i" };
        }
        if (query.email) {
            filterObject.email = { $regex: query.email, $options: "i" };
        }
        if (query.phone) {
            filterObject.phone = { $regex: query.phone, $options: "i" };
        }

        return Promise.all([
            Doctor.find(filterObject)
                .limit(query.pageSize)
                .skip(skip)
                .sort(query.orderBy)
                // .populate("clinics")
                .populate("procedures"),
            Doctor.find(filterObject).countDocuments(),
        ]);
    };

    public getById(id: string): Promise<IDoctor> {
        return Doctor.findById(id).populate("procedures");
    }

    public create(doctor: IDoctorCreateDTO): Promise<IDoctor> {
        // const createdDoctor = await Doctor.create(doctor);
        // return createdDoctor.toObject();
        return Doctor.create(doctor);
    }

    public updateById(
        doctorId: string,
        doctor: Partial<IDoctor>,
    ): Promise<IDoctor> {
        return (
            Doctor.findByIdAndUpdate(doctorId, doctor, { new: true })
                // .populate("clinics")
                .populate("procedures")
        );
    }

    public deleteById(doctorId: string): Promise<IDoctor> {
        return Doctor.findByIdAndDelete(doctorId);
    }

    public findByEmail = (email: string): Promise<IDoctor | null> => {
        return Doctor.findOne({ email });
    };
}

export const doctorRepository = new DoctorRepository();
