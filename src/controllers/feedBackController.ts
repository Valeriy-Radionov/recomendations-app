import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { feedBackService } from "../service/feedback-service/feedbackService"
const ApiError = require("../utils/api-errors/api-error")

export type FeedBackRequestType = {
  email: string
  senderName: string
  message: string
}
export const feedbackController = {
  async feedbackMessage(request: Request<FeedBackRequestType>, response: Response, next: NextFunction) {
    try {
      const errors = validationResult(request)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Incorrect request data", errors.array()))
      }
      const { email, senderName, message } = request.body
      await feedBackService.sendMessage(email, senderName, message)
      return response.json("Message was sent successfully!!!")
    } catch (e) {
      next(e)
    }
  },
}
