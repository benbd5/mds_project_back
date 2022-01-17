const User = require('../models/User')
const { generateToken, extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')
const { Session } = require('../models/Session')

const register = async (req, res) => {
  const { pseudo, email, password, lastname, firstname, phone } = req.body

  if (!pseudo || !email || !password) return res.status(500).send('Email, password or pseudo is missing')

  try {
    const user = new User({
      email, password, firstname, lastname, phone
    })
    user.save((error, result) => {
      if (error) return res.status(500).send(error)

      // Pour supprimer le password, il faut passer le user en objet pour utiliser la méthode delete
      // _user pour ne pas remplacer la constante user
      const _user = result.toObject()
      delete user.password

      // Génération du token
      const payload = {
        id: _user._id
      }
      generateToken(payload, (error, token) => {
        if (error) return res.status(500).send('Error while generating token')
        return res.send({
          user,
          token
        })
      })
    })
  } catch (err) {
    // const error = registerErrors(err)
    // res.status(401).send({ error })
    console.error(err)
    res.status(401).send(err)
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

const getUser = (req, res) => {
  // On récupère l'id depuis le helper
  const id = extractIdFromRequestAuthHeader(req)

  /*   // Méthode Promesse
  User.findById(id).select('-password') // pour ne pas sélectionner le password retournées par mongodb (plus simple avec les promesses)
    .then(result => res.send(result))
    .catch(error => res.status(500).send(error)) */

  try {
    // On récupère les informations de l'utilisateur connecté
    User.findById(id, (error, resultUser) => {
      if (error) return res.status(500).send('Erreur lors de la récupération des informations de l\'utilisateur')

      // On récupère les sessions que l'utilisateur connecté a créé
      // https://docs.mongodb.com/manual/reference/operator/query/in/#op._S_in
      Session.find({ _id: { $in: resultUser.sessions } }, (error, resultSessions) => {
        if (error) return res.status(500).send('Erreur lors de la récupération des informations des sessions liées à l\'utilisateur')

        Session.find({ _id: { $in: resultUser.participation } }, (error, resultParticipation) => {
          if (error) return res.status(500).send('Erreur lors de la récupération des informations des participations liées à l\'utilisateur')

          const allResults = [resultUser, resultSessions, resultParticipation]
          return res.send(allResults)
        })
      })
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

const pictureProfile = async (req, res) => {
  const id = extractIdFromRequestAuthHeader(req)
  const pictureProfile = req.body.files
  console.log('picture req', pictureProfile)
  if (!req.files) return res.status(500).send('Veuillez sélectionner une photo')
  User.findByIdAndUpdate(id, pictureProfile, (error, result) => {
    if (error) return res.status(500).send(error)
    console.log('result', result)
    return result
  })
}

module.exports = {
  register,
  login,
  getUser,
  pictureProfile
}
