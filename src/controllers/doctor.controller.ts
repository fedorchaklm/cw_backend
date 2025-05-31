import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorQuery,
} from "../interfaces/doctor.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { clinicService } from "../services/clinic.service";
import { doctorService } from "../services/doctor.service";
import { procedureService } from "../services/procedure.service";

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
            console.log(">", { doctor });
            let clinics = [];

            for (const name of doctor.clinics) {
                const clinic = await clinicService.getByName(name);
                console.log({ clinic });
                if (!clinic) {
                    console.log(">", "no clinic found");
                    // const addedClinic = await clinicService.create({
                    //     ...clinic,
                    //     procedures: [],
                    //     doctors: [],
                    // });
                    // console.log({ addedClinic });
                    // clinics.push(addedClinic._id);
                    throw new ApiError(
                        "Clinic was not found",
                        StatusCodesEnum.NOT_FOUND,
                    );
                }
                clinics.push(clinic._id);
                console.log({ clinics });
            }
            let procedures = [];
            for (const name of doctor.procedures) {
                const procedure = await procedureService.getByName(name);

                if (!procedure) {
                    // const addedProcedure =
                    //     await procedureService.create(procedure);
                    // procedures.push(addedProcedure._id);
                    throw new ApiError(
                        "Procedure was not found",
                        StatusCodesEnum.NOT_FOUND,
                    );
                }
                procedures.push(procedure._id);
            }
            const data = await doctorService.create({
                ...doctor,
                clinics,
                procedures,
            });
            res.status(StatusCodesEnum.CREATED).json({
                ...data,
                clinics,
                procedures,
            });
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
