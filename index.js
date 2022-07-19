require('dotenv').config()
require('./mongo')

const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const express = require('express')    //Importar el modulo http utilizando Common.JS
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

const logger = require('./loggerMiddleware')

app.use(cors()) //Permitimos que cualquier origen funcione en nuestra API
app.use(express.json())
app.use(express.static('images'))


Sentry.init({
    dsn: "https://7cd13f8b01c64aa88da6976e619b57cb@o1289194.ingest.sentry.io/6507250",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

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

    Note.findById(id)
        .then(note => {
            console.log({ note })
            if (note) return response.json(note)
            response.status(404).end()
        })
        .catch(next)                   //Hacemos que vaya al siguiente Middleware cuando se ejecute este tipo de error               
})                                               // que sería por acceder a un lugar inválido y puede pasar en varios lugares

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
        .catch(next)
})

// Recordar que por la barra de direcciones solo se pueden hacer GET para probar, 
// en el caso que necesite realizar otras acciones debo utilizar las herramientas
// como POSTMAN, INSOMNIA o REST de Visual Studio Code (hay que instalar aquí este último)
app.delete('/api/notes/:id', (request, response, next) => {
    const { id } = request.params

    Note.findByIdAndDelete(id)
        .then(() => response.status(204).end())
        .catch(next)
})

app.post('/api/notes', (request, response, next) => {
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
    }).catch(next)
})

app.use(notFound)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

//Ejemplo de lo que es un MIDDLEWARE (entra cuando no se ejecuta ninguna ruta de arriba)
app.use(handleErrors)

const PORT = process.env.PORT                        //puerto por donde escucha mi servidor
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)   //Como el servidor en Express se inicia de manera asincrona, 
})                                                  //quiero ejecutar el console.log cuando se termine de levantar el servidor

module.exports = { app, server }
