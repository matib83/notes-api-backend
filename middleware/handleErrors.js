module.exports = (error, request, response, next) => {
    console.log('He entrado aqui:')
    console.log(request.path)       //Puedo saBER QUE PATH ME ESTAN PIDIENDO ACCEDER
    console.error(error)            // esto normalmente se envía a un servicio o sitio para saber que ocurrio algo
    console.log(error.name)
    if (error.name === 'CastError') {
        response.status(400).send({ error: 'id used is malformed' }).end()   // error por una solicitud desconocida
    } else {
        response.status(500).end()  //Error de nuestro servidor
    }
}