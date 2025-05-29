import { Router } from "express";

import { doctorRouter } from "./doctor.router";

const router = Router();

router.use("/doctors", doctorRouter);

export const apiRouter = router;
