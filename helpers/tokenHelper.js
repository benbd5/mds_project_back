const jwt = require('jsonwebtoken')

const generateToken = (payload, callback) => {
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (error, token) => {
    if (error) callback(error)
    callback(null, token)
  })
}

const extractIdFromRequestAuthHeader = (req) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = authorization.split(' ')[1]
    if (token) {
      // Retourne l'id du token
      return jwt.decode(token).id
    }
  }
}

module.exports = {
  generateToken,
  extractIdFromRequestAuthHeader
}
