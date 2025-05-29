import { Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { doctorService } from "../services/doctor.service";

class DoctorController {
    public async getAll(_: Request, res: Response<Array<IDoctor>>) {
        const doctors = await doctorService.getAll();
        res.status(StatusCodesEnum.OK).json(doctors);
    }

    public async getById(req: Request, res: Response<IDoctor>) {
        const { id } = req.params;
        const doctors = await doctorService.getById(id);
        res.status(StatusCodesEnum.OK).json(doctors);
    }

    public async create(req: Request, res: Response<IDoctor>) {
        const doctor = req.body as IDoctorDTO;
        const doctors = await doctorService.create(doctor);
        res.status(StatusCodesEnum.CREATED).json(doctors);
    }

    public async updateById(req: Request, res: Response<IDoctor>) {
        const { id } = req.params;
        const doctor = req.body as IDoctorDTO;
        const updatedDoctor = await doctorService.updateById(id, doctor);
        res.status(StatusCodesEnum.OK).json(updatedDoctor);
    }

    public async deleteById(req: Request, res: Response<void>) {
        const { id } = req.params;
        await doctorService.deleteById(id);
        res.status(StatusCodesEnum.NO_CONTENT).end();
    }
}

export const doctorController = new DoctorController();
