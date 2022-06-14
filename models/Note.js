const { Schema, model } = require('mongoose')

// construimos un esquema para utilizar la base de datos (no depende de la base de datos como en sql)
const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean
})

//construimos un modelo
const Note = model('Note', noteSchema)

module.exports = Note

/* Note.find({}).then(result => {
    console.log(result)
    mongoose.connection.close()
}) */

/* //creamos una instancia NOTA
const note = new Note({
    content: 'Mongo db es increible',
    date: new Date(),
    important: true
})

//Guardamos nuestra instancia
note.save()
    .then(result => {
        console.log(result)
        mongoose.connection.close()
    })
    .catch(err => {
        console.error(err)
    }) */