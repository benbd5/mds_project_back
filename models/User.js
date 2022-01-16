const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

// Déclaration du Schéma
const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  pseudo: {
    type: String
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  phone: {
    type: String
  },
  sessions: [{
    type: Schema.Types.ObjectId,
    ref: 'Session'
  }]
}, { timestamps: true })

// Méthode appelé à chaque enregistrement d'utilisateur
UserSchema.pre('save', function (next) {
  // this = user car la fonction est appelée sur le User dans notre code
  const user = this

  // Si le mot de passe a été modifié ou si l'utilisateur est nouveau
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return next(error)
      // Hashage du mdp
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error)
        // Mdp remplacé par le hash
        user.password = hash
        // Suite non bloquante
        return next()
      })
    })
  }
})

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (error, isMatch) => {
    if (error) return callback(error)
    callback(null, isMatch)
  })
}

// La condition en dessous quand on dev car nodemon recharge l'app mais pas tout le temps le modèle
module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
