import { FilterQuery } from "mongoose";

import {
    IProcedure,
    IProcedureCreateDTO,
    IProcedureQuery,
} from "../interfaces/procedure.interface";
import { Procedure } from "../models/procedure.model";

class ProcedureRepository {
    public getAll = (
        query: IProcedureQuery,
    ): Promise<[Array<IProcedure>, number]> => {
        const filterObject: FilterQuery<IProcedure> = {};
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
            orderObject.name = 1;
        }

        return Promise.all([
            Procedure.find(filterObject)
                .sort(orderObject)
                .limit(query.pageSize)
                .skip(skip),
            Procedure.find(filterObject).countDocuments(),
        ]);
    };

    public getById(id: string): Promise<IProcedure | null> {
        return Procedure.findById(id);
    }

    public getByName(name: string): Promise<IProcedure | null> {
        return Procedure.findOne({ name });
    }

    public create(clinic: IProcedureCreateDTO): Promise<IProcedure> {
        return Procedure.create(clinic);
    }

    public updateById(
        procedureId: string,
        procedure: Partial<IProcedure>,
    ): Promise<IProcedure> {
        return Procedure.findByIdAndUpdate(procedureId, procedure, {
            new: true,
        });
    }

    public deleteById(procedureId: string): Promise<IProcedure> {
        return Procedure.findByIdAndDelete(procedureId);
    }
}

export const procedureRepository = new ProcedureRepository();
