const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password, tel } = body
  //const saltRounds = 10
  //const passworHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash: password,
  })

  const savedUser = await newUser.save()
  response.json(savedUser)
})

module.exports = usersRouter