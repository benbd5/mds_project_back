const router = require('express').Router()

const userController = require('../controller/userController')

// Authentification
router.post('/register', userController.register)
router.post('/login', userController.login)

module.exports = router
