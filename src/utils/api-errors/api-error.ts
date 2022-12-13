export class ApiError extends Error {
  status: number
  errors: Error[]

  constructor(status: number, message: string, errors: Error[] = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnautorizedError() {
    return new ApiError(401, "User is not autorized")
  }

  static BadRequest(message: string, errors: Error[] = []) {
    return new ApiError(400, message, errors)
  }
}
