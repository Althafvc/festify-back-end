const express = require('express')
const router = express.Router()
const authController = require('../Cotroller/AuthController')

router.post('/adminsignup',authController.adminSignup)
router.post('/otp',authController.Otp)

module.exports = router