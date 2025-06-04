import { FilterQuery } from "mongoose";

import { QueryOrderEnum } from "../enums/query-order.enum";
import {
    IClinic,
    IClinicCreateDTO,
    IClinicQuery,
} from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";
import { Doctor } from "../models/doctor.model";
import { Procedure } from "../models/procedure.model";

class ClinicRepository {
    public getAll = async (
        query: IClinicQuery,
    ): Promise<[Array<any>, number]> => {
        const filterObject: FilterQuery<IClinic> = {};
        const skip = query.pageSize * (query.page - 1);
        if (query.name) {
            filterObject.name = { $regex: query.name, $options: "i" };
        }

        if (query.procedures) {
            const procedures = await Procedure.find({
                name: { $regex: query.procedures, $options: "i" },
            }).select("_id");

            filterObject["doctors.procedures"] = {
                $in: procedures.map((p) => p._id),
            };
        }

        if (query.doctors) {
            const doctors = await Doctor.find({
                name: { $regex: query.doctors, $options: "i" },
            }).select("_id");

            filterObject.doctors = {
                $in: doctors.map((d) => d._id),
            };
        }

        return await Promise.all([
            Clinic.find(filterObject)
                .limit(query.pageSize)
                .skip(skip)
                .sort(QueryOrderEnum.NAME)
                .populate({
                    path: "doctors",
                    populate: {
                        path: "procedures",
                    },
                }),
            Clinic.find(filterObject).countDocuments(),
        ]);
    };

    public getById(id: string): Promise<any> {
        return Clinic.findById(id).populate("doctors");
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
