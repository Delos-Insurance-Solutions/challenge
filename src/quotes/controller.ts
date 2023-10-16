import { Request, Response } from 'express'
import { quotesError } from './error'
import { AppError, AppSuccess } from '../utils/response'
import * as service from './service'
import * as constants from '../utils/constants'

/*
 * ======
 * QUOTES
 * ======
*/

export async function generateQuotes(req: Request, res: Response) {
  try {
    const generateQuotes = await service.generateQuotes(req.body.name, parseInt(req.body.age), req.body.carModel, parseInt(req.body.yearsOfExperience));
    
    const success_response: AppSuccess = { status: constants.SUCCESS_MSG, code: constants.SUCCESS_CODE, data: generateQuotes }

    return res.status(constants.SUCCESS_CODE).json(success_response)
  } catch (err) {
    return handleError(res, err)
  }
}

export async function getBestQuotes(req: Request, res: Response) {
  try {
    const user_id = req.query.user_id as string;

    const bestQuotes = await service.getBestQuotes(parseInt(user_id));
    
    const success_response: AppSuccess = { status: constants.SUCCESS_MSG, code: constants.SUCCESS_CODE, data: bestQuotes }
    return res.status(constants.SUCCESS_CODE).json(success_response)
  } catch (err) {
    return handleError(res, err)
  }
}

/* Private Functions */

const handleError = async (res: Response, err: any) => {
  const err_response: AppError = {
    status: constants.ERROR_MSG,
    code: constants.SERVER_ERROR_CODE,
    message: constants.SERVER_ERROR_MSG,
    data: null
  }

  if (err.code) { err_response.code = err.code }
  if (err.message) { err_response.message = err.message }
  if (err.data) { err_response.data = err.data }

  console.error('USER : ERROR ERROR ERROR !!')
  console.error(err_response)

  return res.status(constants.SERVER_ERROR_CODE).json(err_response)
}
