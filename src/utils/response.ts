export interface AppError {
  status: string,
  code: number,
  message: string,
  data: any
}

export interface AppSuccess {
  status: string,
  code: number,
  data: any
}
