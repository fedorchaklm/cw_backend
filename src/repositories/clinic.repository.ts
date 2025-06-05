// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheckck
import { FilterQuery, Types } from "mongoose";

import {
    IClinic,
    IClinicCreateDTO,
    IClinicQuery,
} from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public getAll = async (query: IClinicQuery) => {
        const filterObject: FilterQuery<IClinic> = {};
        const { pageSize = 10, page = 1 } = query;
        const skip = pageSize * (page - 1);

        if (query.name) {
            filterObject.name = { $regex: query.name, $options: "i" };
        }

        const orderObject: { [key: string]: 1 | -1 } = {};

        if (query.orderBy === "name") {
            orderObject.name = 1;
        } else if (query.orderBy === "-name") {
            orderObject.name = -1;
        } else {
            orderObject.name = 1;
        }

        const res = await Clinic.aggregate(
            [
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
                        pipeline: [
                            { $project: { createdAt: 0, updatedAt: 0 } },
                        ],
                    },
                },
                // filter by doctor first
                query.doctors != null && {
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
                                                regex: query.doctors, // example: /therapy/i
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
                query.procedures != null && {
                    $match: {
                        $expr: {
                            $anyElementTrue: {
                                $map: {
                                    input: "$procedures",
                                    as: "proc",
                                    in: {
                                        $regexMatch: {
                                            input: "$$proc.name",
                                            regex: query.procedures,
                                            options: "i",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                { $skip: skip },
                { $limit: pageSize },
                {
                    $project: { doctors: 0, procedureIds: 0 },
                },
                {
                    $group: {
                        _id: null,
                        totalItems: { $sum: 1 },
                        data: { $push: "$$ROOT" },
                    },
                },
            ].filter(Boolean),
        );

        return res.length === 0
            ? {
                  totalItems: 0,
                  data: [],
              }
            : res[0];
    };

    public async getById(id: string) {
        // return Clinic.findById(id).populate("doctors");
        const res = await Clinic.aggregate([
            {
                $match: { _id: new Types.ObjectId(id) },
            },
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctors",
                    foreignField: "_id",
                    as: "doctors",
                },
            },
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
            {
                $lookup: {
                    from: "procedures",
                    localField: "procedureIds",
                    foreignField: "_id",
                    as: "procedures",
                    pipeline: [{ $project: { createdAt: 0, updatedAt: 0 } }],
                },
            },
            {
                $project: { doctors: 0, procedureIds: 0 },
            },
        ]);
        console.log({ res: res[0] });
        return res[0];
    }

    public getByName(name: string): Promise<IClinic> {
        return Clinic.findOne({ name });
    }

    public create(clinic: IClinicCreateDTO): Promise<any> {
        return Clinic.create(clinic);
    }

    public async updateById(
        clinicId: string,
        clinic: Partial<IClinic>,
    ): Promise<IClinic> {
        await Clinic.findByIdAndUpdate(clinicId, clinic, { new: true });
        return await this.getById(clinicId);
    }

    public async deleteById(clinicId: string): Promise<IClinic> {
        await Clinic.findByIdAndDelete(clinicId);
        return await this.getById(clinicId);
    }
}

export const clinicRepository = new ClinicRepository();
