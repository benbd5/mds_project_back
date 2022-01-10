const User = require('../models/User')
const { generateToken } = require('../helpers/tokenHelper')
const registerErrors = require('../helpers/errorsHelper')

const register = async (req, res) => {
  const { pseudo, email, password, lastname, firstname, phone } = req.body

  if (!pseudo || !email || !password) return res.status(500).send('Email, password or pseudo is missing')

  try {
    const user = await User.create({ pseudo, email, password, lastname, firstname, phone })
    res.status(201).json({ user })
  } catch (err) {
    const error = registerErrors(err)
    res.status(401).send({ error })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  console.log(email, password)

  if (!email || !password) return res.status(500).send('Email or password is missing')

  try {
    User.findOne({ email }, (error, user) => {
      if (error || !user) return res.status(403).send('Invalid credentials')

      // Comparer les mdp (celui en paramètre et celui stocké dans l'utilisateur récupéré) avec la méthode comparePassword qui se trouve dans le model User
      user.comparePassword(password, (error, isMatch) => {
        if (error || !isMatch) return res.status(500).send('Invalid credentials')

        // Pour supprimer le mot de passe et ne pas le renvoyer lors de la connexion, il faut passer le user en objet pour utiliser la méthode delete
        user = user.toObject()
        delete user.password

        // Si mdp correct, on génère un token et on l'envoit
        // Payload => données stockées à l'intérieur
        const payload = {
          // Données à stocker dans le token
          id: user._id
        }

        // Génération du token
        generateToken(payload, (error, token) => {
          if (error) return res.status(500).send('Error while generating token')
          return res.send({
            user,
            token
          })
        })
      })
    })
  } catch (err) {
    res.status(401).send(err)
  }
}

module.exports = {
  register,
  login
}
