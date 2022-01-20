const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')
const { Session, sportValues } = require('../models/Session')
const User = require('../models/User')

const getSports = (req, res) => {
  try {
    // Retourner le tableau avec les valeurs du modèle pour 'sport'
    return res.send(sportValues)
  } catch (error) {
    return res.status(500).send('Erreur lors de la récupération des sports')
  }
}

const getAllSessions = (req, res) => {
  try {
    Session.find((error, result) => {
      if (error) {
        return res.status(500).send('Erreur lors de la récupération des sessions')
      } else {
        return res.send(result)
      }
    }).sort({ date: -1 })
  } catch (error) {
    return res.status(500).send('Erreur lors de la récupération des sessions')
  }
}

const getOneSession = (req, res) => {
  const id = req.params.id

  if (!id) return res.status(500).send('Id is missing')

  try {
    Session.findById(id, (error, resultSession) => {
      if (error) return res.status(500).send('Erreur lors de la récupération de la session')

      User.find({ _id: { $in: resultSession.members } }, (error, resultUser) => {
        if (error) return res.status(500).send('Erreur lors de la récupération des informations de l\'utilisateur')

        const allResults = [resultSession, resultUser]
        return res.send(allResults)
      })
    })
  } catch (error) {
    return res.status(500).send('Erreur lors de la récupération de la session')
  }
}

const postSession = (req, res) => {
  const { sport, description, place, date, userId } = req.body
  if (!sport) res.status(500).send('Missing sport')
  if (!description) res.status(500).send('Missing description')
  if (!place) res.status(500).send('Missing place')
  if (!date) res.status(500).send('Missing date')

  const session = new Session({
    sport, description, place, date, userId
  })

  try {
    session.save((error, result, next) => {
      if (error) {
        res.status(500).send(error)
      }

      /**
       * Ajout de la session à l'utilisateur connecté qui créé la session
       * $push est une fonction de mongoose : https://docs.mongodb.com/manual/reference/operator/update/push/
       * et permet d'implémenter un tableau, ici, le tableau sessions du model User
       */
      User.findByIdAndUpdate(userId, { $push: { sessions: session._id } }, (error, sess) => {
        if (error) return res.send(500).send('Erreur lors de la récupération des sessions')

        Session.find((error, result) => {
          if (error) return res.send(500).send('Erreur lors de la récupération des sessions')
          return res.send(result)
        })
      })
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

const patchSession = (req, res) => {
  const { body: { session } } = req

  if (!session) return res.status(500).send('session Object is missing')

  const id = session._id
  if (!id) return res.status(500).send('Id is missing')

  try {
    Session.findByIdAndUpdate(id, session, (error, result) => {
      if (error) return res.status(500).send(error)
      else {
        Session.find((error, result) => {
          if (error) {
            return res.status(500).send(error)
          } else {
            return res.send(result)
          }
        })
      }
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

const deleteSession = (req, res) => {
  const { body: { id } } = req

  if (!id) return res.status(500).send('Id is missing')

  try {
    Session.findByIdAndDelete(id, (error, result) => {
      if (error) return res.status(500).send(error)
      else {
        Session.find((error, result) => {
          if (error) {
            return res.status(500).send('Erreur lors de la récupération des sessions')
          } else {
            return res.send(result)
          }
        })
      }
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

// Ajout d'un utilisateur à une session en tant que participant (membre) et ajout de la session dans l'utilisateur en tant que membre
const memberOfSession = (req, res) => {
  // On récupère les id de l'utilisateur et de la session
  const idUser = extractIdFromRequestAuthHeader(req)
  const idSession = req.params.id

  try {
    // Récupération des informations de l'utilisateur
    User.findById(idUser, (error, resultUser) => {
      if (error) return res.status(500).send('Erreur lors de la récupération des informations de l\'utilisateur')

      // Récupération des informations de la session et ajout de l'utilisateur dans les membres
      Session.findByIdAndUpdate(idSession, { $push: { members: idUser } }, (error, result) => {
        if (error) return res.status(500).send(error)

        // Récupération des informations de l'utilisateur et ajout de la session dans les participations
        User.findByIdAndUpdate(idUser, { $push: { participation: idSession } }, (error, sess) => {
          if (error) return res.send(500).send('Erreur lors de la récupération des sessions')

          else {
            Session.find((error, result) => {
              if (error) {
                return res.status(500).send(error)
              } else {
                return res.send(result)
              }
            })
          }
        })
      })
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports = {
  postSession,
  getAllSessions,
  getOneSession,
  getSports,
  patchSession,
  deleteSession,
  memberOfSession
}
