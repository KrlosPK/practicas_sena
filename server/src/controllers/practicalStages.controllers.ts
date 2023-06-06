import { type Request, type Response } from 'express'
import { connection } from '../config/db.js'
import { httpStatus } from '../models/httpStatus.enums.js'
import { handleHTTP } from '../utils/errorsHandler.js'
import { type id } from '../models/user.interfaces.js'
import { type PracticalStages } from '../models/PracticalStages.interfaces.js'

export const getPracticalStages = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const [practicalStages] = await connection.query('SELECT * FROM modalidades_etapa_practica')
    return res.status(httpStatus.OK).json({ data: practicalStages })
  } catch (error) {
    return handleHTTP(res, 'ERROR_GET_PRACTICAL_STAGES')
  }
}

export const getPracticalStageById = async ({ params }: Request<id>, res: Response): Promise<Response> => {
  const { id } = params
  try {
    const [practicalStage] = await connection.query('SELECT * FROM modalidades_etapa_practica WHERE id_modalidad_etapa_practica = ?', [id])
    return res.status(httpStatus.OK).json({ data: practicalStage })
  } catch (error) {
    return handleHTTP(res, 'ERROR_GET_PRACTICAL_STAGE')
  }
}

export const createPracticalStage = async ({ body }: Request<PracticalStages>, res: Response): Promise<Response> => {
  const { tipo_modalidad_practica, num_horas_minimas_modalidad_practica, num_horas_maximas_modalidad_practica } = body
  try {
    await connection.query('INSERT INTO modalidades_etapa_practica (tipo_modalidad_practica,num_horas_minimas_modalidad_practica,num_horas_maximas_modalidad_practica) VALUE (?, ?, ?)', [tipo_modalidad_practica, num_horas_minimas_modalidad_practica, num_horas_maximas_modalidad_practica])
    return res.status(httpStatus.OK).json(true)
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error })
    // return handleHTTP(res, error)
  }
}