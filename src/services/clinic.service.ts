import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IClinic,
    IClinicCreateDTO,
    IClinicQuery,
} from "../interfaces/clinic.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { clinicRepository } from "../repositories/clinic.repository";

class ClinicService {
    public getAll = async (
        query: IClinicQuery,
    ): Promise<IPaginatedResponse<IClinic>> => {
        const { data, totalItems } = await clinicRepository.getAll(query);
        const totalPages = Math.ceil(totalItems / query.pageSize);
        return {
            totalItems,
            totalPages,
            prevPage: !!(query.page - 1),
            nextPage: query.page + 1 <= totalPages,
            data,
        };
    };

    public async getById(id: string): Promise<IClinic> {
        const clinic = await clinicRepository.getById(id);
        if (!clinic) {
            throw new ApiError(
                `Clinic with such id ${id} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return clinic;
    }

    public getByName(name: string): Promise<IClinic> {
        return clinicRepository.getByName(name);
    }

    public create(clinic: IClinicCreateDTO): Promise<IClinic> {
        return clinicRepository.create(clinic);
    }

    public async updateById(
        clinicId: string,
        clinic: Partial<IClinic>,
    ): Promise<IClinic> {
        const existsClinic = await clinicRepository.getById(clinicId);
        if (!existsClinic) {
            throw new ApiError(
                `Clinic with such id ${clinicId} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return await clinicRepository.updateById(clinicId, clinic);
    }

    public async deleteById(clinicId: string): Promise<IClinic> {
        const clinic = await clinicRepository.getById(clinicId);
        if (!clinic) {
            throw new ApiError(
                `Clinic with such id ${clinicId} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return await clinicRepository.deleteById(clinicId);
    }
}

export const clinicService = new ClinicService();
