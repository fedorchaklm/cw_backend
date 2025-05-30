import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(UserValidator.create),
    authController.signUp,
);

router.post("/sign-in", authController.signIn);
// router.get("/me", authMiddleware.checkAccessToken, authController.me);
// router.post(
//     "/refresh",
//     commonMiddleware.validateBody(AuthValidator.refresh),
//     authMiddleware.checkrefreshToken,
//     authController.refresh,
// );
export const authRouter = router;
