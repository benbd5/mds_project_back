const router = require('express').Router()

const userController = require('../controller/userController')

// Authentification
router.post('/auth/register', userController.register)
router.post('/auth/login', userController.login)

module.exports = router
