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
        const { totalItems, data } = await doctorRepository.getAll(query);
        const totalPages = Math.ceil(totalItems / query.pageSize);
        return {
            totalItems,
            totalPages,
            prevPage: !!(query.page - 1),
            nextPage: query.page + 1 <= totalPages,
            data,
        };
    };

    public async getById(id: string): Promise<any> {
        const doctor = await doctorRepository.getById(id);
        console.log({ doctor });
        if (!doctor) {
            throw new ApiError(
                `Doctor with such id ${id} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return doctor;
    }

    public create(doctor: IDoctorCreateDTO): Promise<IDoctor> {
        return doctorRepository.create(doctor);
    }

    public async updateById(
        doctorId: string,
        doctor: Partial<IDoctor>,
    ): Promise<IDoctor> {
        const existedDoctor = await doctorRepository.getById(doctorId);
        console.log({ existedDoctor });
        if (!existedDoctor) {
            throw new ApiError(
                `Doctor with such id ${doctorId} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }

        return await doctorRepository.updateById(doctorId, doctor);
    }

    public async deleteById(doctorId: string): Promise<IDoctor> {
        const doctor = await doctorRepository.getById(doctorId);

        if (!doctor) {
            throw new ApiError(
                `Doctor with such id ${doctorId} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return await doctorRepository.deleteById(doctorId);
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
