import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { authService, LoginRegistrationResponseType } from "../service/authService"
const ApiError = require("../utils/api-errors/api-error")

type RegistrationRequestType = {
  email: string
  password: string
}

export const authController = {
  async registration(request: Request<RegistrationRequestType>, response: Response<LoginRegistrationResponseType>, next: NextFunction) {
    try {
      const errors = validationResult(request)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Incorrect request data", errors.array()))
      }
      const { email, password } = request.body
      const userData = await authService.registration(email, password)

      if (userData) {
        response.cookie("refreshToken", userData?.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
        return response.json(userData)
      }
    } catch (e) {
      next(e)
    }
  },

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body
      const userData = await authService.login(email, password)
      if (userData) {
        response.cookie("refreshToken", userData?.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
        return response.json(userData)
      }
    } catch (e) {
      next(e)
    }
  },

  async logout(request: Request, response: Response, next: NextFunction) {
    try {
      const { refreshToken } = request.cookies
      const token = await authService.logout(refreshToken)
      response.clearCookie("refreshToken")
      return response.json({ token })
    } catch (e) {
      next(e)
    }
  },

  async activate(request: Request, response: Response, next: NextFunction) {
    try {
      const activationLink = request.params.link
      await authService.activate(activationLink)
      return response.redirect(process.env.CLIENT_URL!)
    } catch (e) {
      next(e)
    }
  },

  async refresh(request: Request, response: Response, next: NextFunction) {
    try {
      const { refreshToken } = request.cookies
      const userData = await authService.refresh(refreshToken)
      if (userData) {
        response.cookie("refreshToken", userData?.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
        return response.json(userData)
      }
    } catch (e) {
      next(e)
    }
  },

  async getUsers(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await authService.getAllUsers()
      response.json(users)
    } catch (e) {
      next(e)
    }
  },
}
