const { Schema, model } = require('mongoose')

// construimos un esquema para utilizar la base de datos (no depende de la base de datos como en sql)
const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean
})

//Lo que hacemos acá es decir al Schema de nota, como quiero que .json haga la transmormacion del objeto
// Si no especifico esto, response.json(notes) devuelve un objeto muy conplejo y con _id y __v q no sirve
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id  // agrego al objeto el id sin el guion bajo al lado
        delete returnedObject._id               // elimino los campos que no quiero. Recordemos que 
        delete returnedObject.__v               // estoy borrando la trnasformación a JSON y no los datos
    }                                           // crudos de la BD, por eso puedo utilizar delete
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