import { FilterQuery, Types } from "mongoose";

import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorQuery,
} from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";

class DoctorRepository {
    public getAll = async (query: IDoctorQuery) => {
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

        const orderObject: { [key: string]: 1 | -1 } = {};

        if (query.orderBy) {
            if (query.orderBy.startsWith("-")) {
                orderObject[query.orderBy.slice(1)] = -1;
            } else {
                orderObject[query.orderBy] = 1;
            }
        } else {
            orderObject.firstName = 1;
        }

        const res = await Doctor.aggregate([
            {
                $match: filterObject,
            },
            { $skip: skip },
            { $limit: query.pageSize },
            {
                $sort: orderObject,
            },
            {
                $lookup: {
                    from: "clinics",
                    let: { doctorId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$$doctorId", "$doctors"] },
                            },
                        },
                        {
                            $project: { name: 1 },
                        },
                    ],
                    as: "clinics",
                },
            },
            {
                $lookup: {
                    from: "procedures",
                    localField: "procedures",
                    foreignField: "_id",
                    as: "procedures",
                    pipeline: [{ $project: { name: 1 } }],
                },
            },
            {
                $group: {
                    _id: null,
                    totalItems: { $sum: 1 },
                    data: { $push: "$$ROOT" },
                },
            },
            {
                $project: { _id: 0 },
            },
        ]);

        return res.length === 0
            ? {
                  totalItems: 0,
                  data: [],
              }
            : res[0];
    };

    public async getById(id: string) {
        const res = await Doctor.aggregate([
            {
                $match: { _id: new Types.ObjectId(id) },
            },
            {
                $lookup: {
                    from: "clinics",
                    let: { doctorId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$$doctorId", "$doctors"] },
                            },
                        },
                        {
                            $project: { name: 1 },
                        },
                    ],
                    as: "clinics",
                },
            },
            {
                $lookup: {
                    from: "procedures",
                    localField: "procedures",
                    foreignField: "_id",
                    as: "procedures",
                    pipeline: [{ $project: { name: 1 } }],
                },
            },
        ]);

        return res[0];
    }

    public async create(doctor: IDoctorCreateDTO): Promise<IDoctor> {
        const createdDoctor = await Doctor.create(doctor);
        return await this.getById(createdDoctor._id);
    }

    public async updateById(
        doctorId: string,
        doctor: Partial<IDoctor>,
    ): Promise<IDoctor> {
        await Doctor.findByIdAndUpdate(doctorId, doctor, { new: true });
        return await this.getById(doctorId);
    }

    public deleteById(doctorId: string): Promise<IDoctor> {
        return Doctor.findByIdAndDelete(doctorId);
    }

    public findByEmail = (email: string): Promise<IDoctor | null> => {
        return Doctor.findOne({ email });
    };
}

export const doctorRepository = new DoctorRepository();
