import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { doctorService } from "../services/doctor.service";

class DoctorController {
    public async getAll(
        _: Request,
        res: Response<Array<IDoctor>>,
        next: NextFunction,
    ) {
        try {
            const doctors = await doctorService.getAll();
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
            const doctor = req.body as IDoctorDTO;
            const doctors = await doctorService.create(doctor);
            res.status(StatusCodesEnum.CREATED).json(doctors);
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
            const doctor = req.body as IDoctorDTO;
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
