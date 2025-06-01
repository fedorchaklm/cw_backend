import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import {
    IProcedure,
    IProcedureCreateDTO,
    IProcedureQuery,
} from "../interfaces/procedure.interface";
import { procedureService } from "../services/procedure.service";

class ProcedureController {
    public async getAll(
        req: Request,
        res: Response<IPaginatedResponse<IProcedure> | null>,
        next: NextFunction,
    ) {
        try {
            const query = req.query as any as IProcedureQuery;
            const procedures = await procedureService.getAll(query);
            res.status(StatusCodesEnum.OK).json(procedures);
        } catch (e) {
            next(e);
        }
    }

    public async getById(
        req: Request,
        res: Response<IProcedure>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const procedure = await procedureService.getById(id);
            res.status(StatusCodesEnum.OK).json(procedure);
        } catch (e) {
            next(e);
        }
    }

    public async create(
        req: Request,
        res: Response<IProcedure>,
        next: NextFunction,
    ) {
        try {
            const procedure = req.body as IProcedureCreateDTO;
            const procedureDuplicate = await procedureService.getByName(
                procedure.name,
            );
            if (procedureDuplicate) {
                throw new ApiError(
                    `Procedure ${procedureDuplicate.name} already exists!`,
                    StatusCodesEnum.BAD_REQUEST,
                );
            }
            const data = await procedureService.create(procedure);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(
        req: Request,
        res: Response<IProcedure>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const procedure = req.body as IProcedureCreateDTO;
            const updatedProcedure = await procedureService.updateById(
                id,
                procedure,
            );
            res.status(StatusCodesEnum.OK).json(updatedProcedure);
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
            await procedureService.deleteById(id);
            res.status(StatusCodesEnum.NO_CONTENT).end();
        } catch (e) {
            next(e);
        }
    }
}

export const procedureController = new ProcedureController();
