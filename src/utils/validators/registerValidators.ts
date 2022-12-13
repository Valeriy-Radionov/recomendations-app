import { body } from "express-validator"

export const isEmail = body("email").trim().isEmail().withMessage("Email address is not corrected")
export const passwordIsrequired = body("password").trim().isLength({ min: 6, max: 32 }).withMessage("Password must be more 5 symbols, but less 32 symbols")
