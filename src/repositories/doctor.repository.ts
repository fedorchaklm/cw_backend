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

        if (query.name) {
            filterObject.name = { $regex: query.name, $options: "i" };
        }
        if (query.surname) {
            filterObject.price = { $regex: query.surname, $options: "i" };
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
                .populate("clinics")
                .populate("procedures"),
            Doctor.find(filterObject).countDocuments(),
        ]);
    };

    public getById(id: string): Promise<IDoctor> {
        return Doctor.findById(id).populate("clinics").populate("procedures");
    }

    public async create(doctor: IDoctorCreateDTO): Promise<IDoctor> {
        const createdDoctor = await Doctor.create(doctor);
        return createdDoctor.toObject();
    }

    public updateById(
        doctorId: string,
        doctor: Partial<IDoctor>,
    ): Promise<IDoctor> {
        return Doctor.findByIdAndUpdate(doctorId, doctor, { new: true });
    }

    public deleteById(doctorId: string): Promise<IDoctor> {
        return Doctor.findByIdAndDelete(doctorId);
    }
}

export const doctorRepository = new DoctorRepository();
