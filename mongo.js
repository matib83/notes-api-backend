const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

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


