import { FilterQuery } from "mongoose";

import {
    IClinic,
    IClinicCreateDTO,
    IClinicQuery,
} from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public getAll = async (query: IClinicQuery) => {
        const filterObject: FilterQuery<IClinic> = {};
        const skip = query.pageSize * (query.page - 1);
        if (query.name) {
            filterObject.name = { $regex: query.name, $options: "i" };
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

        console.log(">query", query);

        const res = await Clinic.aggregate([
            {
                $match: filterObject,
            },
            {
                $sort: orderObject,
            },
            // Lookup doctors for each clinic
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctors",
                    foreignField: "_id",
                    as: "doctors",
                },
            },
            // Flatten all doctors' procedures into one array
            {
                $addFields: {
                    procedureIds: {
                        $reduce: {
                            input: "$doctors",
                            initialValue: [],
                            in: {
                                $setUnion: ["$$value", "$$this.procedures"],
                            },
                        },
                    },
                },
            },
            // Lookup actual procedure documents
            {
                $lookup: {
                    from: "procedures",
                    localField: "procedureIds",
                    foreignField: "_id",
                    as: "procedures",
                },
            },
            // filter by doctor first
            {
                $match: {
                    $expr: {
                        $anyElementTrue: {
                            $map: {
                                input: "$doctors",
                                as: "doc",
                                in: {
                                    $or: [
                                        "firstName",
                                        "lastName",
                                        "email",
                                        "phone",
                                    ].map((field) => ({
                                        $regexMatch: {
                                            input: `$$doc.${field}`,
                                            regex: query.doctors ?? "", // example: /therapy/i
                                            options: "i",
                                        },
                                    })),
                                },
                            },
                        },
                    },
                },
            },
            // filter by procedure name
            {
                $match: {
                    $expr: {
                        $anyElementTrue: {
                            $map: {
                                input: "$procedures",
                                as: "proc",
                                in: {
                                    $regexMatch: {
                                        input: "$$proc.name",
                                        regex: query.procedures ?? "",
                                        options: "i",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            { $skip: skip },
            { $limit: query.pageSize },
            {
                $group: {
                    _id: null,
                    totalItems: { $sum: 1 },
                    data: { $push: "$$ROOT" },
                },
            },
            {
                $project: { procedureIds: 0 },
            },
        ]);

        // return res;

        return res.length === 0
            ? {
                  totalItems: 0,
                  data: [],
              }
            : res[0];
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
