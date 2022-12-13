import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import { tokenModel } from "../models/tokenModal"
type GenerateTokenType = {
  accessToken: string
  refreshToken: string
}
type PayloadType = {
  email: string
  id: ObjectId
  isActivated: boolean
}
export const tokenService = {
  async generateTokens(payload: PayloadType): Promise<GenerateTokenType> {
    const accToken = process.env.JWT_ACCESS_SECRET
    const refToken = process.env.JWT_REFRESH_SECRET
    const accessToken = jwt.sign(payload, accToken!, { expiresIn: "30m" })
    const refreshToken = jwt.sign(payload, refToken!, { expiresIn: "30d" })
    return { accessToken, refreshToken }
  },
  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
      return userData
    } catch (e) {
      return null
    }
  },
  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET!)
      return userData
    } catch (e) {
      return null
    }
  },
  async saveToken(userId: ObjectId, refreshToken: string) {
    const tokenData = await tokenModel.findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await tokenModel.create({ user: userId, refreshToken })
    return token
  },

  async removeToken(refreshToken: string) {
    const tokenData = tokenModel.deleteOne({ refreshToken })
    return tokenData
  },

  async findToken(refreshToken: string) {
    const tokenData = tokenModel.findOne({ refreshToken })
    return tokenData
  },
}
