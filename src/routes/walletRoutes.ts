import express from 'express'
import * as WalletController from '../controllers/walletController'
import { fauxAuth } from '../middlewares/faux'
const router = express.Router()



router.post('/fund-wallet',[fauxAuth()], WalletController.fundWallet)

export default router