require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT
const cors = require('cors')

// Import du middleware pour logger les appels d'API
const loggerMiddleware = require('./middlewares/logger')
app.use(loggerMiddleware)

// Autoriser les requêtes depuis le front React (Access Control Allow Origin)
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

try {
  mongoose
    .connect(`mongodb+srv://${process.env.DB_USER_PASS}@cluster0.tvfvl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
  console.log('Connecté à Mongo')
} catch (error) {
  console.error(error)
}

// Routes
const sessionRoutes = require('./routes/sessionRoutes')
const userRoutes = require('./routes/userRoutes')

app.use(sessionRoutes)
app.use(userRoutes)

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
