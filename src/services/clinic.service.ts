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

    public async getClinicsIdsFromNames(
        clinicNames: Array<string>,
    ): Promise<Array<string>> {
        const clinicIds = [];
        for (const name of clinicNames) {
            const clinic = await this.getByName(name);
            console.log({ clinic });
            if (!clinic) {
                console.log(">", "no clinic found");
                throw new ApiError(
                    `Clinic '${name}' was not found`,
                    StatusCodesEnum.NOT_FOUND,
                );
            }
            clinicIds.push(clinic._id);
            console.log({ clinicIds });
        }
        return clinicIds;
    }

    public async addDoctorToClinics(
        doctorId: string,
        clinicIds: Array<string>,
    ): Promise<void> {
        // clinicIds.map(async (id) => {
        //     const clinic = await this.getById(id);
        //     if (!clinic.doctors.includes(doctorId)) {
        //         clinic.doctors.push(doctorId);
        //         await this.updateById(id, clinic);
        //     }
        // });
        for (const clinicId of clinicIds) {
            const clinic = await this.getById(clinicId);
            if (!clinic.doctors.includes(doctorId)) {
                clinic.doctors.push(doctorId);
            }
            await this.updateById(clinicId, clinic);
        }
    }

    public async addProcedureToClinic(
        clinicIds: Array<string>,
        procedureIds: Array<string>,
    ): Promise<void> {
        // clinicIds.map((clinicId) => {
        //     const clinic = await this.getById(clinicId);
        // procedureIds.map(async (id) => {
        //     if (!clinic.procedures.includes(clinicId)) {
        //         clinic.doctors.push(clinicId);
        //     }
        //         await this.updateById(clinicId, clinic);
        // });
        // })
        for (const clinicId of clinicIds) {
            const clinic = await this.getById(clinicId);
            for (const procedureId of procedureIds) {
                if (!clinic.procedures.includes(procedureId)) {
                    clinic.procedures.push(procedureId);
                }
            }
            await this.updateById(clinicId, clinic);
        }
    }
}

export const clinicService = new ClinicService();
