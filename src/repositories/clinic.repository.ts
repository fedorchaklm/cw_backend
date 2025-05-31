import { FilterQuery } from "mongoose";

import {
    IClinic,
    IClinicCreateDTO,
    IClinicQuery,
} from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public getAll = (query: IClinicQuery): Promise<[Array<any>, number]> => {
        const filterObject: FilterQuery<IClinic> = {};
        const skip = query.pageSize * (query.page - 1);

        if (query.name) {
            filterObject.name = { $regex: query.name, $options: "i" };
        }
        if (query.procedures) {
            filterObject.procedures = {
                $regex: query.procedures,
                $options: "i",
            };
        }
        if (query.doctors) {
            filterObject.doctors = { $regex: query.doctors, $options: "i" };
        }

        return Promise.all([
            Clinic.find(filterObject)
                .limit(query.pageSize)
                .skip(skip)
                .sort(query.orderBy)
                .populate("doctors")
                .populate("procedures"),
            Clinic.find(filterObject).countDocuments(),
        ]);
    };

    public getById(id: string): Promise<IClinic> {
        return Clinic.findById(id);
    }

    public getByName(name: string): Promise<IClinic> {
        return Clinic.findOne({ name });
    }

    public create(clinic: IClinicCreateDTO): Promise<any> {
        return Clinic.create(clinic);
    }

    public updateById(
        clinicId: string,
        clinic: Partial<IClinic>,
    ): Promise<IClinic> {
        return Clinic.findByIdAndUpdate(clinicId, clinic, { new: true });
    }

    public deleteById(clinicId: string): Promise<IClinic> {
        return Clinic.findByIdAndDelete(clinicId);
    }
}

export const clinicRepository = new ClinicRepository();
