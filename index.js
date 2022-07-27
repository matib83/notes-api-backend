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
const notesRouter = require('./controllers/notes')

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

app.use('/api/notes', notesRouter)

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
