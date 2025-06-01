import { Router } from "express";

import { procedureController } from "../controllers/procedure.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { ProcedureValidator } from "../validators/procedure.validator";

const router = Router();

router.get(
    "/",
    authMiddleware.checkAccessToken,
    commonMiddleware.query(ProcedureValidator.query),
    procedureController.getAll,
);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    commonMiddleware.validateBody(ProcedureValidator.create),
    procedureController.create,
);
router.get(
    "/:id",
    commonMiddleware.isValidate("id"),
    authMiddleware.checkAccessToken,
    procedureController.getById,
);
router.patch(
    "/:id",
    commonMiddleware.isValidate("id"),
    commonMiddleware.validateBody(ProcedureValidator.update),
    procedureController.updateById,
);
router.delete(
    "/:id",
    commonMiddleware.isValidate("id"),
    procedureController.deleteById,
);

export const procedureRouter = router;
