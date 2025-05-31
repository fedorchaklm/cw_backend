import { Router } from "express";

import { clinicController } from "../controllers/clinic.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { ClinicValidator } from "../validators/clinic.validator";

const router = Router();

router.get(
    "/",
    authMiddleware.checkAccessToken,
    commonMiddleware.query(ClinicValidator.query),
    clinicController.getAll,
);
router.post(
    "/",
    commonMiddleware.validateBody(ClinicValidator.create),
    clinicController.create,
);
router.get(
    "/:id",
    commonMiddleware.isValidate("id"),
    authMiddleware.checkAccessToken,
    clinicController.getById,
);
router.put(
    "/:id",
    commonMiddleware.isValidate("id"),
    commonMiddleware.validateBody(ClinicValidator.update),
    clinicController.updateById,
);
router.delete(
    "/:id",
    commonMiddleware.isValidate("id"),
    clinicController.deleteById,
);

export const clinicRouter = router;
