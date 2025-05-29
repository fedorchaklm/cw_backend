import { Router } from "express";

import { doctorController } from "../controllers/doctor.controller";

const router = Router();

router.get("/", doctorController.getAll);
router.post("/", doctorController.create);
router.get("/:id", doctorController.getById);
router.put("/:id", doctorController.updateById);
router.delete("/:id", doctorController.deleteById);

export const doctorRouter = router;
