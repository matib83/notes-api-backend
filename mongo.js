const mongoose = require('mongoose')
const password = require('./password.js')

const connectionString = `mongodb+srv://matib83:${password}@cluster0.d2jmj.mongodb.net/matidb?retryWrites=true&w=majority`

//conexion a mongodb
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
    //useCreateIndex: true    // Nos ayuda a buscar documentos, porque lo mete en memoria y busca mucho mas rapido
})
    .then(() => {
        console.log('Database connected')
    }).catch(err => {
        console.log(err)
    })


