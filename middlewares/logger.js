// Fonction appelée à chaque appel d'API
const loggerMiddleware = (req, res, next) => {
  if (req) {
    console.info(
      `[${new Date().toLocaleString()}] Requête ${req.method} reçue de ${req.ip} à destination de ${req.url}`
    )
  }
  next()
}

module.exports = loggerMiddleware
