const router = require('express').Router()

const userController = require('../controller/userController')
const withAuth = require('../middlewares/authMiddleware')

// Authentification
router.post('/auth/register', userController.register)
router.post('/auth/login', userController.login)
router.get('/profile', withAuth, userController.getUser)

module.exports = router
