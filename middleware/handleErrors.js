module.exports = (error, request, response, next) => {
    console.log('He entrado aqui:')
    console.log(request.path)       //Puedo saBER QUE PATH ME ESTAN PIDIENDO ACCEDER
    console.error({ error })        // esto normalmente se envía a un servicio o sitio para saber que ocurrio algo
    console.error(error.name)       // Lo utiliza para ver que error esta llegando
    if (error.name === 'CastError') {
        response.status(400).send({ error: 'id used is malformed' }).end()   // error por una solicitud desconocida
    } else if (error.name === 'ValidationError') {
        response.status(409).send({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        response.status(401).send({ error: 'token missing or invalid' }).end()   // error por token invalido
    } else {
        response.status(500).end()  //Error de nuestro servidor
    }
}

