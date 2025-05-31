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

    public getById(id: string): Promise<IProcedure> {
        return procedureRepository.getById(id);
    }

    public getByName(name: string): Promise<IProcedure> {
        return procedureRepository.getByName(name);
    }

    public create(clinic: IProcedureCreateDTO): Promise<IProcedure> {
        return procedureRepository.create(clinic);
    }

    public updateById(
        procedureId: string,
        procedure: Partial<IProcedure>,
    ): Promise<IProcedure> {
        return procedureRepository.updateById(procedureId, procedure);
    }

    public async deleteById(procedureId: string): Promise<IProcedure> {
        const procedure = await procedureRepository.getById(procedureId);

        if (procedure === null) {
            throw new ApiError(
                "Procedure not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return await procedureRepository.deleteById(procedureId);
    }
}

export const procedureService = new ProcedureService();
