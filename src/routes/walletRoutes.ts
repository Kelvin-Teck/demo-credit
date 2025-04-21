import express from 'express'
import * as WalletController from '../controllers/walletController'
import { fauxAuth } from '../middlewares/faux'
const router = express.Router()



router.post('/fund-wallet',[fauxAuth()], WalletController.fundWallet)
router.post('/transfer', [fauxAuth()], WalletController.transferFunds)
router.post('/withdraw',[fauxAuth()], WalletController.withdrawFunds)


export default router