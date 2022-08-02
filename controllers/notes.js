const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

//cambio el metodo de promesas por async, await
notesRouter.get('/', async (request, response) => {  //Cuando nuestra aplicacion reciba un request desde el path general
  const notes = await Note.find({})
  response.json(notes)                                //Me resuelve el content type, el status, etc
})

notesRouter.get('/:id', (request, response, next) => {  //Así puedo recuperar parámetros dinámicos del path o URL
  const { id } = request.params                   // extraigo el ID del response (es un String)    
  console.log({ id })

  Note.findById(id)
    .then(note => {
      console.log({ note })
      if (note) return response.json(note)
      response.status(404).end()
    })
    .catch(next)                   //Hacemos que vaya al siguiente Middleware cuando se ejecute este tipo de error               
})

//Ahora realizamos la peticion de PUT para modificar contenido
notesRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result).status(204).end()
    })
    .catch(next)
})

// Recordar que por la barra de direcciones solo se pueden hacer GET para probar, 
// en el caso que necesite realizar otras acciones debo utilizar las herramientas
// como POSTMAN, INSOMNIA o REST de Visual Studio Code (hay que instalar aquí este último)
notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  await Note.findByIdAndDelete(id)
  response.status(204).end()

  // Antes utilizando promesas
  // Note.findByIdAndDelete(id)
  //     .then(() => response.status(204).end())
  //     .catch(next)
})

//cambio el metodo de promesas por async, await
notesRouter.post('/', async (request, response, next) => {
  const {
    content,
    important = false,
    userId
  } = request.body

  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'required "content" fild is missing'
    })
  }

  const newNote = new Note({
    content: content,
    date: new Date().toISOString(),
    important,
    user: user._id  // Cuando se guarde en la BD, el id se almacena con la barra baja, sino, 
  })                // debo hacer: user.toJSON().id para acceder al objeto id sin barra baja

  // ******ANTES CON PROMESAS*******
  // newNote.save().then(saveNote => {
  //     response.status(201).json(saveNote)
  // }).catch(next)

  // AHORA CON ASYNC-AWAIT
  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter