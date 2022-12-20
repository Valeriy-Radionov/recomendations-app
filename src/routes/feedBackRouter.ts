import { Router } from "express"
import { feedbackController } from "../controllers/feedBackController"
import { isEmail } from "../utils/validators/registerValidators"

export const feedBackRouter = Router({})
feedBackRouter.post("/", isEmail, feedbackController.feedbackMessage)
