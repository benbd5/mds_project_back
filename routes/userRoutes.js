const router = require('express').Router()
const User = require('../models/User')

// Multer pour ajouter des photos de profile
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  dest: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}.jpg`)
  }
})
const upload = multer({ storage: storage })

const userController = require('../controller/userController')
const withAuth = require('../middlewares/authMiddleware')
const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')

// Authentification
router.post('/auth/register', userController.register)
router.post('/auth/login', userController.login)
router.get('/profile', withAuth, userController.getUser)

// Ajout d'une photo de profile
router.patch('/profile/image', upload.single('file'), (req, res, next) => {
  // On récupère l'id contenu dans le token de la requête pour reconnaître l'utilisateur
  const id = extractIdFromRequestAuthHeader(req)

  // Le nom de la photo de profile est le nom du chemin où le fichier est stocké
  User.findByIdAndUpdate(id, { pictureProfile: req.file.path }, (error, result) => {
    if (error) return res.status(500).send(error)
    console.log('result', result)
    return res.send(result)
  })
})

module.exports = router
