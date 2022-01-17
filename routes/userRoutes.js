const router = require('express').Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const userController = require('../controller/userController')
const withAuth = require('../middlewares/authMiddleware')

// Authentification
router.post('/auth/register', userController.register)
router.post('/auth/login', userController.login)
router.get('/profile', withAuth, userController.getUser)
router.patch('/profile/image', upload.single('file'), userController.pictureProfile)

module.exports = router
