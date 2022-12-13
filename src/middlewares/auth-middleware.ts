import { NextFunction, Request, Response } from "express"
import { tokenService } from "../service/tokenService"
import { ApiError } from "../utils/api-errors/api-error"

interface AuthUserRequest extends Request {
  user?: string
}
export const authMiddleware = (request: AuthUserRequest, response: Response, next: NextFunction) => {
  try {
    const authorizationHeader = request.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.UnautorizedError())
    }
    const accessToken = authorizationHeader.split(" ")[1]
    if (!accessToken) {
      return next(ApiError.UnautorizedError())
    }
    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiError.UnautorizedError())
    }
    request.user = userData as string
    next()
  } catch (e) {
    return next(ApiError.UnautorizedError())
  }
}
