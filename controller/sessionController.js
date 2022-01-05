const { Session, sportValues } = require('../models/Session')

const getSports = (req, res) => {
  try {
    // Retourner le tableau avec les valeurs du modèle pour 'sport'
    return res.send(sportValues)
  } catch (error) {
    return res.status(500).send(error)
  }
}

const getAllSessions = (req, res) => {
  try {
    Session.find((error, result) => {
      if (error) {
        return res.status(500).send('Erreur lors de la récupération des restaurants')
      } else {
        return res.send(result)
      }
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

const getOneSession = (req, res) => {
  const id = req.params.id

  if (!id) return res.status(500).send('Id is missing')

  try {
    Session.findById(id, (error, result) => {
      if (error) {
        return res.status(500).send('Erreur lors de la récupération de la session')
      } else {
        return res.send(result)
      }
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

const postSession = async (req, res) => {
  const { sport, description, place, date } = req.body
  console.log(req.body)
  if (!sport) res.status(500).send('Missing sport')
  if (!description) res.status(500).send('Missing description')
  if (!place) res.status(500).send('Missing place')
  if (!date) res.status(500).send('Missing date')

  try {
    const session = new Session({
      sport, description, place, date
    })

    session.save((error, result) => {
      if (error) return res.status(500).send(error)
      Session.find((error, result) => {
        if (error) {
          return res.status(500).send('Erreur lors de la récupération des restaurants')
        } else {
          return res.send(result)
        }
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

module.exports = {
  postSession,
  getAllSessions,
  getOneSession,
  getSports,
  patchSession,
  deleteSession
}
