import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getAll);

// router.post(
//     "/",
//     commonMiddleware.validateBody(UserValidator.create),
//     userController.create,
// );

router.get("/:id", commonMiddleware.isValidate("id"), userController.getById);
router.put(
    "/:id",
    commonMiddleware.isValidate("id"),
    commonMiddleware.validateBody(UserValidator.update),
    userController.updateById,
);
router.patch(
    "/:id/block",
    commonMiddleware.isValidate("id"),
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    userController.blockUser,
);

router.patch(
    "/:id/unblock",
    commonMiddleware.isValidate("id"),
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    userController.unBlockUser,
);
router.delete(
    "/:id",
    commonMiddleware.isValidate("id"),
    userController.deleteById,
);

export const userRouter = router;
