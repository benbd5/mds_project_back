const mongoose = require('mongoose')
const { Schema } = mongoose

const SessionSchema = Schema({
  sport: {
    type: String,
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

module.exports = mongoose.model('Session', SessionSchema)
