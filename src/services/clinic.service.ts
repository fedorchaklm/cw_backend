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
        const [data, totalItems] = await clinicRepository.getAll(query);
        const totalPages = Math.ceil(totalItems / query.pageSize);
        return {
            totalItems,
            totalPages,
            prevPage: !!(query.page - 1),
            nextPage: query.page + 1 <= totalPages,
            data,
        };
    };

    public getById(id: string): Promise<IClinic> {
        return clinicRepository.getById(id);
    }

    public getByName(name: string): Promise<IClinic> {
        return clinicRepository.getByName(name);
    }

    public create(clinic: IClinicCreateDTO): Promise<IClinic> {
        return clinicRepository.create(clinic);
    }

    public updateById(
        clinicId: string,
        clinic: Partial<IClinic>,
    ): Promise<IClinic> {
        return clinicRepository.updateById(clinicId, clinic);
    }

    public deleteById(clinicId: string): Promise<IClinic> {
        return clinicRepository.deleteById(clinicId);
    }
}

export const clinicService = new ClinicService();
