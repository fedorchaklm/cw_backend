import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import {
    IProcedure,
    IProcedureCreateDTO,
    IProcedureQuery,
} from "../interfaces/procedure.interface";
import { procedureRepository } from "../repositories/procedure.repository";

class ProcedureService {
    public getAll = async (
        query: IProcedureQuery,
    ): Promise<IPaginatedResponse<IProcedure>> => {
        const [data, totalItems] = await procedureRepository.getAll(query);
        const totalPages = Math.ceil(totalItems / query.pageSize);
        return {
            totalItems,
            totalPages,
            prevPage: !!(query.page - 1),
            nextPage: query.page + 1 <= totalPages,
            data,
        };
    };

    public async getById(id: string): Promise<IProcedure> {
        const procedure = await procedureRepository.getById(id);
        if (procedure === null) {
            throw new ApiError(
                `Procedure with such id ${id} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return procedure;
    }

    public getByName(name: string): Promise<IProcedure> {
        return procedureRepository.getByName(name);
    }

    public create(clinic: IProcedureCreateDTO): Promise<IProcedure> {
        return procedureRepository.create(clinic);
    }

    public async updateById(
        procedureId: string,
        procedure: Partial<IProcedure>,
    ): Promise<IProcedure> {
        const existedProcedure = await procedureRepository.getById(procedureId);
        if (existedProcedure === null) {
            throw new ApiError(
                `Procedure with such id ${procedureId} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return await procedureRepository.updateById(procedureId, procedure);
    }

    public async deleteById(procedureId: string): Promise<IProcedure> {
        const procedure = await procedureRepository.getById(procedureId);

        if (procedure === null) {
            throw new ApiError(
                `Procedure with such id ${procedureId} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return await procedureRepository.deleteById(procedureId);
    }

    // public async getProceduresIdsFromNames(
    //     procedureNames: Array<string>,
    // ): Promise<Array<string>> {
    //     const procedureIds = [];
    //     for (const name of procedureNames) {
    //         const procedure = await this.getByName(name);
    //         if (!procedure) {
    //             throw new ApiError(
    //                 `Procedure '${name}' was not found`,
    //                 StatusCodesEnum.NOT_FOUND,
    //             );
    //         }
    //         procedureIds.push(procedure._id);
    //     }
    //     return procedureIds;
    // }
}

export const procedureService = new ProcedureService();
