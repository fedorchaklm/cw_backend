import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    userController.getAll,
);

router.get(
    "/:id",
    commonMiddleware.isValidate("id"),
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    userController.getById,
);
router.patch(
    "/:id",
    commonMiddleware.isValidate("id"),
    commonMiddleware.validateBody(UserValidator.update),
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    userController.updateById,
);
router.delete(
    "/:id",
    commonMiddleware.isValidate("id"),
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    userController.deleteById,
);

export const userRouter = router;
