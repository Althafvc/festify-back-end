const express = require('express')
const router = express.Router()
const adminController = require('../Cotroller/AdminController')

router.post('/addprogram',adminController.addProgram)

module.exports = router