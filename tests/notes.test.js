const mongoose = require('mongoose')
const supertest = require('supertest')

const { app, server } = require('../index')
const Note = require('../models/Note')

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
  }
]

beforeEach(async () => {
  await Note.deleteMany({})

  const note1 = new Note(initialNotes[0])
  await note1.save()

  const note2 = new Note(initialNotes[1])
  await note2.save()
})

// Como el test es asíncrono, debo hacer el famoso async, await: lo que le informo a node, que test se ejecute
// pero que espere a que termine api para responder
test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(2)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})