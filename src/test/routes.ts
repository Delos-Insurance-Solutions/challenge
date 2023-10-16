import { Router, Request, Response } from 'express'
const router = Router()

router.use((req: Request, res: Response, next: Function) => {
  console.log('* Route : TEST')
  console.log(req.originalUrl)
  next()
})

/*
 * ===========
 * TEST ROUTES
 * ===========
*/

router.get('/serverstatus', async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      data: {
        message: 'Server is running from test route!!'
      }
    })
  } catch (err) {
    return res.status(500).json({
      data: {
        message: 'Server is not responding'
      }
    })
  }
})

export default router
