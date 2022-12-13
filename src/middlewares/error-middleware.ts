import { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/api-errors/api-error"
type ErrorMiddlewareType = {
  message: string
  errors?: Error[]
}

export const errorMiddleware = (err: any, request: Request, response: Response<ErrorMiddlewareType>, next: NextFunction) => {
  console.log(err)
  if (err instanceof ApiError) {
    return response.status(err.status).json({ message: err.message, errors: err.errors })
  }
  return response.status(500).json({ message: "Unexpected error" })
}
