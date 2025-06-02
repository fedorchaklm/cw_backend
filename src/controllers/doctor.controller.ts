import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorQuery,
} from "../interfaces/doctor.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { clinicService } from "../services/clinic.service";
import { doctorService } from "../services/doctor.service";

class DoctorController {
    public async getAll(
        req: Request,
        res: Response<IPaginatedResponse<IDoctor> | null>,
        next: NextFunction,
    ) {
        try {
            const query = req.query as any as IDoctorQuery;
            const doctors = await doctorService.getAll(query);
            res.status(StatusCodesEnum.OK).json(doctors);
        } catch (e) {
            next(e);
        }
    }

    public async getById(
        req: Request,
        res: Response<IDoctor>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const doctors = await doctorService.getById(id);
            res.status(StatusCodesEnum.OK).json(doctors);
        } catch (e) {
            next(e);
        }
    }

    public async create(
        req: Request,
        res: Response<IDoctor>,
        next: NextFunction,
    ) {
        try {
            const doctor = req.body as IDoctorCreateDTO;
            await doctorService.isEmailUnique(doctor.email);
            // const clinicIds = await clinicService.getClinicsIdsFromNames(
            //     doctor.clinics,
            // );
            // const procedureIds =
            //     await procedureService.getProceduresIdsFromNames(
            //         doctor.procedures,
            //     );
            // const data = await doctorService.create({
            //     ...doctor,
            //     clinics: doctor.clinics,
            //     procedures: doctor.procedures,
            // });
            // await clinicService.addDoctorToClinics(data._id, doctor.clinics);
            // res.status(StatusCodesEnum.CREATED).json({
            //     ...data,
            //     clinics: doctor.clinics,
            //     procedures: doctor.procedures,
            // });
            const data = await doctorService.create(doctor);
            await clinicService.addDoctorToClinics(data._id, doctor.clinics);
            await clinicService.addProcedureToClinic(
                doctor.clinics,
                doctor.procedures,
            );
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(
        req: Request,
        res: Response<IDoctor>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const doctor = req.body as IDoctorCreateDTO;
            const updatedDoctor = await doctorService.updateById(id, doctor);
            res.status(StatusCodesEnum.OK).json(updatedDoctor);
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(
        req: Request,
        res: Response<void>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            await doctorService.deleteById(id);
            res.status(StatusCodesEnum.NO_CONTENT).end();
        } catch (e) {
            next(e);
        }
    }
}

export const doctorController = new DoctorController();
