import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IClinic,
    IClinicCreateDTO,
    IClinicQuery,
} from "../interfaces/clinic.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { clinicService } from "../services/clinic.service";

class ClinicController {
    public async getAll(
        req: Request,
        res: Response<IPaginatedResponse<IClinic> | null>,
        next: NextFunction,
    ) {
        try {
            const query = req.query as any as IClinicQuery;
            const clinics = await clinicService.getAll(query);
            res.status(StatusCodesEnum.OK).json(clinics);
        } catch (e) {
            next(e);
        }
    }

    public async getById(
        req: Request,
        res: Response<IClinic>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const clinic = await clinicService.getById(id);
            res.status(StatusCodesEnum.OK).json(clinic);
        } catch (e) {
            next(e);
        }
    }

    public async create(
        req: Request,
        res: Response<IClinic>,
        next: NextFunction,
    ) {
        try {
            const clinic = req.body;
            const clinicDuplicate = await clinicService.getByName(clinic.name);
            if (clinicDuplicate) {
                throw new ApiError(
                    `Clinic ${clinicDuplicate.name} already exists!`,
                    StatusCodesEnum.BAD_REQUEST,
                );
            }
            const data = await clinicService.create(clinic);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(
        req: Request,
        res: Response<IClinic>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const clinic = req.body as IClinicCreateDTO;
            const updatedClinic = await clinicService.updateById(id, clinic);
            res.status(StatusCodesEnum.OK).json(updatedClinic);
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
            await clinicService.deleteById(id);
            res.status(StatusCodesEnum.NO_CONTENT).end();
        } catch (e) {
            next(e);
        }
    }
}

export const clinicController = new ClinicController();
