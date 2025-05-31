import { Router } from "express";

import { authRouter } from "./auth.router";
import { clinicRouter } from "./clinic.router";
import { doctorRouter } from "./doctor.router";
import { procedureRouter } from "./procedure.router";
import { userRouter } from "./user.router";

const router = Router();

router.use("/doctors", doctorRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/procedures", procedureRouter);
router.use("/clinics", clinicRouter);

export const apiRouter = router;
