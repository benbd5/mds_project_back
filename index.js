require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT
const cors = require('cors')

// Autoriser les requêtes depuis le front React (Access Control Allow Origin)
app.use(cors())

app.get('/test', (req, res) => {
  res.json({
    name: 'Bob'
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
