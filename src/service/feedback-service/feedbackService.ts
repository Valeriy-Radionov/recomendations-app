import { ApiError } from "../../utils/api-errors/api-error"
import { mailService } from "../mailService"

export const feedBackService = {
  async sendMessage(email: string, senderName: string, message: string) {
    try {
      await mailService.sendFeedBackMail(email, senderName, message)
    } catch (e) {
      throw ApiError.BadRequest(`Failed to send message`)
    }
  },
}
