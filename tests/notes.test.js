const mongoose = require('mongoose')
const { server } = require('../index')

const Note = require('../models/Note')
const { api, initialNotes, getAllContentFromNotes, loginUsers } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})
  // Parallel (puedo tener errores en el test que controla la posicion de una nota, ya que no se puede asegurar
  // que la nota se agregue en el orden que yo lo defino en helpers: initialNotes, ya que se hacen en paralelo)
  /* const notesObjects = initialNotes.map(note => new Note(note))
  const promises = notesObjects.map(note => note.save())
  await Promise.all(promises) //cuando este método termina, significa que se cumplieron todas las promesas */

  // sequential (para asegurar el orden definido, pero es mas lento)
  for (const note of initialNotes) {
    const notesObjects = new Note(note)
    await notesObjects.save()
  }
})

describe('GET all notes', () => {
  // Como el test es asíncrono, debo hacer el famoso async, await: lo que le informo a node, que test se ejecute
  // pero que espere a que termine api para responder
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-type', /application\/json/)
  })

  test('there are two notes', async () => {
    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('The first note is about learning', async () => {
    const { response } = await getAllContentFromNotes()

    expect(response.body[0].content).toBe('Aprendiendo Fullstack JS')
  })

  test('Some notes content is about midudev', async () => {
    const { contents } = await getAllContentFromNotes()

    expect(contents).toContain('Sígueme en https://midu.tube')
  })
})

describe('create a note', () => {

  test('is possible with a valid note', async () => {
    const token = await loginUsers()
    const newNote = {
      content: 'Proximamente async/await',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('is not possible with an invalid note', async () => {
    const token = await loginUsers()
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('delete a note with token root', () => {
  test('can be deleted', async () => {
    const token = await loginUsers()
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0] //Otra forma: const [noteToDelete] = notes

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const { contents, response: secondResponse } = await getAllContentFromNotes()

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)
  })

  test('but do not exist, can not be deleted', async () => {
    const token = await loginUsers()
    await api
      .delete(`/api/notes/1234a5678901234a56a789aa`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('but malformed id, can not be deleted', async () => {
    const token = await loginUsers()

    await api
      .delete(`/api/notes/1234`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})