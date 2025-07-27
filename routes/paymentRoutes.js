import express from 'express'
import { initiatePayfastPayment, payfastNotifyHandler } from '../controllers/paymentController.js'

const router = express.Router()

router.post('/payfast', initiatePayfastPayment)
router.post('/notify', payfastNotifyHandler)

export default router