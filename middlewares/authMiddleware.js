const jwt = require('jsonwebtoken')

// Intercepter la validation d'authentification par jwt
const withAuth = (req, res, next) => {
  // On cherche le header Authorization dans la requête
  if (req.headers.authorization) {
    // On extrait le token car le format dans le header est "Bearer <token>"
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).send('Unauthorized: No token provided')

    // On vérifie l'authenticité du token avec la phrase secrète
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) return res.status(401).send('Unauthorized: invalid Token')

      next()
    })
  } else {
    res.status(401).send('Unauthorized: No authorization Header')
  }
}

module.exports = withAuth
