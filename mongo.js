const mongoose = require('mongoose')

// Extrigo todas las variables de entorno que necesitamos
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test'  // cuando sla variable de entorno node_env es test, utilizo la BD de test
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

//conexion a mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true    // Nos ayuda a buscar documentos, porque lo mete en memoria y busca mucho mas rapido
})
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.log(err)
  })

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
