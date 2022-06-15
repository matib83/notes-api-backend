require('dotenv').config()
require('./mongo')

const express = require('express')    //Importar el modulo http utilizando Common.JS
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

const logger = require('./loggerMiddleware')

app.use(cors()) //Permitimos que cualquier origen funcione en nuestra API
app.use(express.json())

app.use(logger)

// const app = http.createServer((request, response) => {      //Callback, funcion que se ejecuta cada vez que
//     response.writeHead(200, { 'Content-Type':'application/json'}) //le llegue un request (petición al servidor)
//     response.end(JSON.stringify(notes))                              //responde enla cabecera con status 200
// })

app.get('/', (request, response) => {        //Cuando nuestra aplicacion reciba un request desde el path general
    response.send('<h1>Hello Word<h1>')
})

app.get('/api/notes', (request, response) => {       //Cuando nuestra aplicacion reciba un request desde el path general
    Note.find({}).then(notes => {
        response.json(notes)                        //Me resuelve el content type, el status, etc
    })
})

app.get('/api/notes/:id', (request, response, next) => {  //Así puedo recuperar parámetros dinámicos del path o URL
    const { id } = request.params                   // extraigo el ID del response (es un String)    
    console.log({ id })

    Note.findById(id).then(note => {
        console.log({ note })
        if (note) {
            return response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        next(err)                   //Hacemos que vaya al siguiente Middleware cuando se ejecute este tipo de error
    })                              // que sería por acceder a un lugar inválido y puede pasar en varios lugares
})

//Ahora realizamos la peticion de PUT para modificar contenido
app.put('/api/notes/:id', (request, response, next) => {
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
})

// Recordar que por la barra de direcciones solo se pueden hacer GET para probar, 
// en el caso que necesite realizar otras acciones debo utilizar las herramientas
// como POSTMAN o INSOMNIA
app.delete('/api/notes/:id', (request, response, next) => {
    const { id } = request.params
    Note.findByIdAndRemove(id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/notes', (request, response) => {
    const note = request.body

    if (!note || !note.content) {
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const newNote = new Note({
        content: note.content,
        date: new Date().toISOString(),
        important: typeof note.important !== 'undefined' ? note.important : false
    })

    newNote.save().then(saveNote => {
        response.status(201).json(saveNote)
    })
})

app.use(notFound)

//Ejemplo de lo que es un MIDDLEWARE (entra cuando no se ejecuta ninguna ruta de arriba)
app.use(handleErrors)

const PORT = process.env.PORT                        //puerto por donde escucha mi servidor

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)   //Como el servidor en Express se inicia de manera asincrona, 
})                                                  //quiero ejecutar el console.log cuando se termine de levantar el servidor

