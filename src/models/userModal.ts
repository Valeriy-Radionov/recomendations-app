import { model, Schema } from "mongoose"
export type Role = "admin" | "user"
const UserScema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  role: { type: String, enum: ["admin", "user"], default: "user" },
})
export const UserModel = model("User", UserScema)
