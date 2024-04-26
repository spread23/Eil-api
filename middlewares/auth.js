const jwt = require('jwt-simple')
const moment = require('moment')

const { secret_key } = require('../services/jwt')

exports.auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 'error',
            message: 'La consulta no tiene la autorizacion de la cabecera'
        })
    }

    const token = req.headers.authorization.replace(/["']+/g, "")

    try {

        const payload = jwt.decode(token, secret_key)

        if (payload.exp <= moment().unix()) {
            return res.status(401).json({
                status: 'error',
                message: 'El token ha expirado'
            })
        }

        req.user = payload

    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Error en la decodificacion del token'
        })
    }

    next()
}