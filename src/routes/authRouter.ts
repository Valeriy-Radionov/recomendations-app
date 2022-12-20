import { Router } from "express"
import { authController } from "../controllers/authController"
import { feedbackController } from "../controllers/feedBackController"
import { authMiddleware } from "../middlewares/auth-middleware"
import { isEmail, passwordIsrequired } from "../utils/validators/registerValidators"

export const authRouter = Router({})
authRouter.post("/registration", isEmail, passwordIsrequired, authController.registration)
authRouter.post("/login", authController.login)
authRouter.get("/activate/:link", authController.activate)
authRouter.post("/logout", authController.logout)
authRouter.get("/refresh", authController.refresh)
authRouter.get("/users", authMiddleware, authController.getUsers)
