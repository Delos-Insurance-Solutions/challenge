import { Router, Request, Response } from 'express'
import { generateQuotes, getBestQuotes } from './controller'

const router = Router()

router.use((req: Request, res: Response, next: Function) => {
  console.log('* Route : QUOTES')
  console.log(req.originalUrl)
  next()
})

/*
 * ===========
 * QUOTES ROUTES
 * ===========
*/

// get user by GUID
router.post('/', [generateQuotes])

// get user by User ID
router.get('/best-three', [getBestQuotes])

export default router
