import { Router } from "express";

import { doctorController } from "../controllers/doctor.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { DoctorValidator } from "../validators/doctor.validator";

const router = Router();

router.get("/", doctorController.getAll);
router.post(
    "/",
    commonMiddleware.validateBody(DoctorValidator.create),
    doctorController.create,
);
router.get("/:id", commonMiddleware.isValidate("id"), doctorController.getById);
router.put(
    "/:id",
    commonMiddleware.isValidate("id"),
    commonMiddleware.validateBody(DoctorValidator.update),
    doctorController.updateById,
);
router.delete(
    "/:id",
    commonMiddleware.isValidate("id"),
    doctorController.deleteById,
);

export const doctorRouter = router;
