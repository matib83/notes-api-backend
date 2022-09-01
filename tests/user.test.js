const mongoose = require('mongoose')
const { server } = require('../index')

const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')  // para poder utilizar las api del index.js

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'matiroot', passwordHash })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers() //Optimizo el codigo y uilizo helpers, pero no olvidar que es asincrono

    const newUser = {
      username: 'matib83',
      name: 'Matias',
      password: 'abc123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await getUsers()  //Optimizo el codigo, pero no olvidar que es asincrono

    expect(userAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = userAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  // HAGO TDD, es decir, primero creo el test que controle una nueva funcionalidad, lo ejecuto y 
  // comienzo a desarrollar la funcionalidad siendo controlado por el test
  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'matiroot',
      name: 'Matias',
      password: 'abc123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('`username` to be unique')

    const userAtEnd = await getUsers()
    expect(userAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})