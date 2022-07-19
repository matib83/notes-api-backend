const mongoose = require('mongoose')
const supertest = require('supertest')

const { app, server } = require('../index')
const Note = require('../models/Note')
const { initialNotes } = require('./helpers')

const api = supertest(app)

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
  expect(response.body).toHaveLength(initialNotes.length)
})

test('The first note is about learning', async () => {
  const response = await api.get('/api/notes')
  expect(response.body[0].content).toBe('Aprendiendo Fullstack JS')
})

test('Some notes content is about midudev', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(note => note.content)
  expect(contents).toContain('Sígueme en https://midu.tube')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'Proximamente async/await',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(note => note.content)
  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(newNote.content)
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})