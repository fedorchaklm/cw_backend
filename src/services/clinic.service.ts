/* eslint-ignore-file */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IClinic,
    IClinicCreateDTO,
    IClinicQuery,
} from "../interfaces/clinic.interface";
// import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { clinicRepository } from "../repositories/clinic.repository";

class ClinicService {
    public getAll = async (query: IClinicQuery) => {
        return await clinicRepository.getAll(query);
        // const [data, totalItems] = await clinicRepository.getAll(query);
        // const totalPages = Math.ceil(totalItems / query.pageSize);
        // return {
        //     totalItems,
        //     totalPages,
        //     prevPage: !!(query.page - 1),
        //     nextPage: query.page + 1 <= totalPages,
        //     data,
        // };
    };

    public async getById(id: string): Promise<IClinic> {
        const clinic = await clinicRepository.getById(id);
        if (clinic === null) {
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
        if (existsClinic === null) {
            throw new ApiError(
                `Clinic with such id ${clinicId} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return await clinicRepository.updateById(clinicId, clinic);
    }

    public async deleteById(clinicId: string): Promise<IClinic> {
        const clinic = await clinicRepository.getById(clinicId);

        if (clinic === null) {
            throw new ApiError(
                `Clinic with such id ${clinicId} not found!`,
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return await clinicRepository.deleteById(clinicId);
    }

    // public async getClinicsIdsFromNames(
    //     clinicNames: Array<string>,
    // ): Promise<Array<string>> {
    //     const clinicIds = [];
    //     for (const name of clinicNames) {
    //         const clinic = await this.getByName(name);
    //         if (!clinic) {
    //             throw new ApiError(
    //                 `Clinic '${name}' was not found`,
    //                 StatusCodesEnum.NOT_FOUND,
    //             );
    //         }
    //         clinicIds.push(clinic._id);
    //     }
    //     return clinicIds;
    // }

    // public async addDoctorToClinics(
    //     doctorId: string,
    //     clinicIds: Array<string>,
    // ): Promise<void> {
    //     for (const clinicId of clinicIds) {
    //         const clinic = await this.getById(clinicId);
    //         if (!clinic.doctors.includes(doctorId)) {
    //             clinic.doctors.push(doctorId);
    //         }
    //         await this.updateById(clinicId, clinic);
    //     }
    // }

    // public async addProcedureToClinic(
    //     clinicIds: Array<string>,
    //     procedureIds: Array<string>,
    // ): Promise<void> {
    //     for (const clinicId of clinicIds) {
    //         const clinic = await this.getById(clinicId);
    //         clinic.procedures = [
    //             ...new Set([...procedureIds, ...clinic.procedures]),
    //         ];
    //         await this.updateById(clinicId, clinic);
    //     }
    // }
}

export const clinicService = new ClinicService();
