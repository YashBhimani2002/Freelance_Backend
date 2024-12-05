const express = require('express');
const {middleware} = require('../middleware')
const paymentRouter = express.Router()
const PaymentController = require('../controller/PaymentController')


paymentRouter.post('/flutterwave/callback', PaymentController.flutterwaveCallback);
paymentRouter.post('/stripe/checkoutsession', PaymentController.checkoutsession);
paymentRouter.post('/paysteck-payment', PaymentController.paystack);
paymentRouter.post('/demoPayStack-payment', PaymentController.demoPayStack);
paymentRouter.post('/getMailUser',PaymentController.getMailUser);



module.exports = paymentRouter;