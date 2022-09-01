//Ejemplo de lo que es un MIDDLEWARE como función
const logger = ((request, response, next) => {
    // console.log(request.method)
    // console.log(request.path)
    // console.log(request.body)
    // console.log('-----')
    next()      //linea para que el servidor luego de mostrarte los logs anteriores, continue ejecutando codigo
})

module.exports = logger