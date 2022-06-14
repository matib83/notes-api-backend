require('dotenv').config()
require('./mongo')

const express = require('express')    //Importar el modulo http utilizando Common.JS
const app = express()
const cors = require('cors')
const Note = require('./models/Note')

const logger = require('./loggerMiddleware')

app.use(cors()) //Permitimos que cualquier origen funcione en nuestra API
app.use(express.json())

app.use(logger)

let notes = []

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

// Recordar que por la barra de direcciones solo se pueden hacer GET para probar, 
// en el caso que necesite realizar otras acciones debo utilizar las herramientas
// como POSTMAN o INSOMNIA
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
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

//Ejemplo de lo que es un MIDDLEWARE (entra cuando no se ejecuta ninguna ruta de arriba)
app.use((error, request, response, next) => {
    console.log('He entrado aqui:')
    console.log(request.path)       //Puedo saBER QUE PATH ME ESTAN PIDIENDO ACCEDER
    console.error(error)            // esto normalmente se envía a un servicio o sitio para saber que ocurrio algo
    console.log(error.name)
    if (error.name === 'CastError') {
        response.status(400).json({
            error: 'Solicitud incorrecta'      // error por una solicitud desconocida
        }).end()
    } else {
        response.status(500).end()  //Error de nuestro servidor
    }
})

const PORT = process.env.PORT                        //puerto por donde escucha mi servidor

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)   //Como el servidor en Express se inicia de manera asincrona, 
})                                                  //quiero ejecutar el console.log cuando se termine de levantar el servidor

