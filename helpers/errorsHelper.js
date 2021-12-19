const registerErrors = (err) => {
  const errors = { pseudo: '', email: '', password: '' }

  if (err.message.includes('pseudo')) { errors.pseudo = 'Pseudo incorrect ou déjà pris' }

  if (err.message.includes('email')) { errors.email = 'Email incorrect' }

  //   if (err.message.includes('password')) { errors.password = 'Le mot de passe doit faire 6 caractères minimum' }

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) { errors.pseudo = 'Ce pseudo est déjà utilisé' }

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) { errors.email = 'Cet email est déjà utilisée' }

  return errors
}

module.exports = {
  registerErrors
}
