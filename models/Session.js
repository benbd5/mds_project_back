const mongoose = require('mongoose')
const { Schema } = mongoose

const SessionSchema = Schema({
  sport: {
    type: String,
    enum: ['Surf', 'Wing foil', 'Bodyboard', 'Kite-Surf'],
    required: true
  },
  description: {
    type: String
  },
  place: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  members: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

const Session = mongoose.model('Session', SessionSchema)

// Accès aux valeurs 'enum' de sport pour les réutiliser en React lors de l'ajout d'une session
const sportValues = Session.schema.path('sport').enumValues

module.exports = {
  Session,
  sportValues
}
