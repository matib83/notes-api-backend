const mongoose = require('mongoose')
const { server } = require('../index')

const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api } = require('./helpers')  // para poder utilizar las api del index.js

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'matiroot', passwordHash })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersDB = await User.find({})
    const usersAtStart = usersDB.map(user => user.toJSON())

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

    const usersDBAfter = await User.find({})
    const userAtEnd = usersDBAfter.map(user => user.toJSON())

    expect(userAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = userAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})