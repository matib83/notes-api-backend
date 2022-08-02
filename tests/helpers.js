const { app } = require('../index')
const supertest = require('supertest')

const api = supertest(app)

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

module.exports = { api, initialNotes, getAllContentFromNotes }