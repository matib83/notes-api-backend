const uniqueValidator = require('mongoose-unique-validator')
const { Schema, model } = require('mongoose')

//console.log('se ejecuta user.js') //Esto sirve para saber si estoy ejecutando este codigo una vez (que es lo correcto)
// construimos un esquema para utilizar la base de datos (no depende de la base de datos como en sql)
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,    // Para avisar que es un array de objetos de Id (poniendo los [] primero) y {} luego
    ref: 'Note'                     // Referencia a Notas, para utilizar unas funcionalidades especiales
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id  // agrego al objeto el id sin el guion bajo al lado
    delete returnedObject._id               // elimino los campos que no quiero. Recordemos que
    delete returnedObject.__v               // estoy borrando la trnasformación a JSON y no los datos
    // crudos de la BD, por eso puedo utilizar delete
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

//construimos un modelo
const User = model('User', userSchema)

module.exports = User
