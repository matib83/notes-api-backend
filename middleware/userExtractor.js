const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authorization = request.get('authorization')
  let token = ''

  //console.log({ authorization })

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  console.log({ token })

  const decodedToken = jwt.verify(token, process.env.SECRET)
  console.log({ decodedToken })

  // if (!token || !decodedToken.id) {
  //   console.log('entro aqui 2')
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }

  const { id: userId } = decodedToken
  request.userId = userId //Mutacion de la request con la info que quiero preservar (el acces token)
  next()
}