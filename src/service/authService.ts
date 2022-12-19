import bcrypt from "bcrypt"
import { ObjectId } from "mongodb"
import { v4 } from "uuid"
import { Role, UserModel } from "../models/userModal"
import { ApiError } from "../utils/api-errors/api-error"
import { mailService } from "./mailService"
import { tokenService } from "./tokenService"

export type LoginRegistrationResponseType = {
  accessToken: string
  refreshToken: string
  user: { id: string; email: string; isActivated: boolean; role: Role }
}
export const authService = {
  async registration(email: string, password: string): Promise<LoginRegistrationResponseType | undefined> {
    const candidate = await UserModel.findOne({ email: email })
    if (candidate) {
      throw ApiError.BadRequest(`User with this email: ${email} alredy exists`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = v4()
    const user = await UserModel.create({ email, password: hashPassword, activationLink })
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
    const tokens = await tokenService.generateTokens({ email: user.email!, id: user._id, isActivated: user.isActivated, role: user.role })
    const refToken = tokens.refreshToken
    await tokenService.saveToken(user._id, refToken)
    return {
      ...tokens,
      user: { id: user.id, email: user.email!, isActivated: user.isActivated, role: user.role },
    }
  },

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiError.BadRequest(`User with email: ${email} was not found`)
    }
    const isPassEquals = await bcrypt.compare(password, user.password!)
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Incorrect password`)
    }
    const tokens = await tokenService.generateTokens({ email: user.email!, id: user._id, isActivated: user.isActivated, role: user.role })
    const refToken = tokens.refreshToken
    await tokenService.saveToken(user._id, refToken)
    return {
      ...tokens,
      user: { id: user.id, email: user.email!, isActivated: user.isActivated, role: user.role },
    }
  },

  async activate(activationLink: string) {
    const user = await UserModel.findOne({ activationLink })
    if (!user) {
      throw ApiError.BadRequest("Invalid activation link")
    }
    user.isActivated = true
    await user.save()
  },

  async logout(refreshToken: string) {
    const result = await tokenService.removeToken(refreshToken)
    return result
  },

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnautorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnautorizedError()
    }
    const user = await UserModel.findById(tokenFromDb.user?._id)
    if (user) {
      const tokens = await tokenService.generateTokens({ email: user.email!, id: user?._id, isActivated: user?.isActivated, role: user.role })
      const refToken = tokens.refreshToken
      await tokenService.saveToken(user?._id, refToken)
      return {
        ...tokens,
        user: { id: user.id, email: user.email!, isActivated: user.isActivated, role: user.role },
      }
    }
  },
  async getAllUsers() {
    const users = await UserModel.find()
    return users
  },
}
