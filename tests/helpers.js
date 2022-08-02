const { app } = require('../index')
const supertest = require('supertest')
const User = require('../models/User')
const api = supertest(app)  //El modelo no es nombrado

const initialNotes = [
  {
    content: 'Aprendiendo Fullstack JS',
    important: true,
    date: new Date()
  },
  {
    content: 'Sígueme en https://midu.tube',
    important: true,
    date: new Date()
  },
  {
    content: 'Gracias totales :D',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}
const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
  getUsers
}