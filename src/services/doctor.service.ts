import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorQuery,
} from "../interfaces/doctor.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { doctorRepository } from "../repositories/doctor.repository";

class DoctorService {
    public getAll = async (
        query: IDoctorQuery,
    ): Promise<IPaginatedResponse<IDoctor>> => {
        const [data, totalItems] = await doctorRepository.getAll(query);
        const totalPages = Math.ceil(totalItems / query.pageSize);
        return {
            totalItems,
            totalPages,
            prevPage: !!(query.page - 1),
            nextPage: query.page + 1 <= totalPages,
            data,
        };
    };

    public getById(id: string): Promise<IDoctor> {
        return doctorRepository.getById(id);
    }

    public create(doctor: IDoctorCreateDTO): Promise<IDoctor> {
        return doctorRepository.create(doctor);
    }

    public updateById(
        doctorId: string,
        doctor: Partial<IDoctor>,
    ): Promise<IDoctor> {
        return doctorRepository.updateById(doctorId, doctor);
    }

    public deleteById(doctorId: string): Promise<IDoctor> {
        return doctorRepository.deleteById(doctorId);
    }

    public isEmailUnique = async (email: string) => {
        const doctor = await doctorRepository.findByEmail(email);

        if (doctor !== null) {
            throw new ApiError(
                "Doctor is already exists",
                StatusCodesEnum.BAD_REQUEST,
            );
        }
    };
}

export const doctorService = new DoctorService();
