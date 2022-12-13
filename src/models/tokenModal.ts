import { model, Schema } from "mongoose"

const TokenScema = new Schema({
  refreshToken: { type: String, require: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
})
export const tokenModel = model("Token", TokenScema)
