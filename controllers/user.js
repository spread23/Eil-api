const bcrypt = require('bcrypt')

const validate = require('../helpers/validate')
const User = require('../models/user')
const { createToken } = require('../services/jwt')

const test = (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Endpoint de test'
    })
}

const register = async (req, res) => {
    const params = req.body

    if (!params.name || !params.nick || !params.email || !params.password) {
        return res.status(404).json({
            status: 'error',
            message: 'faltan parametros'
        })
    }

    try {
        validate(params)
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error en la validacion',
            error: error.message
        })
    }

    try {

        const userFound = await User.find({
            $or: [
                { email: params.email },
                { nick: params.nick }
            ]
        })

        if (userFound && userFound.length >= 1) {
            return res.status(200).json({
                status: 'success',
                message: 'El usuario ya existe'
            })
        }

        const pwd = await bcrypt.hash(params.password, 10)
        params.password = pwd

        const userToSave = new User(params)
        const userStorage = await userToSave.save()

        return res.status(201).json({
            status: 'success',
            message: 'Usuario registrado satisfactoriamente',
            user: userStorage
        })

    } catch (error) {
        return res.status(404).json({
            status: 'error',
            message: 'Error en la encriptacion de password',
            error: error.message,
        })
    }
}

const login = async (req, res) => {
    const params = req.body

    if (!params.email || !params.password) {
        return res.status(404).json({
            status: 'error',
            message: 'Faltan parametros'
        })
    }

    try {
        validate(params)
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error en la validacion de datos',
            error: error.message
        })
    }

    try {

        const userFound = await User.findOne({
            email: params.email
        })

        if (!userFound) {
            return res.status(404).json({
                status: 'error',
                message: 'Email incorrecto'
            })
        }

        const pwd = bcrypt.compare(params.password, userFound.password)
        if (!pwd) res.status(400).json({ status: 'error', message: 'Las contraseñas no coinciden' })
        
        const token = createToken(userFound)

        return res.status(200).json({
            status: 'success',
            message: 'Usuario logeado exitosamente',
            user: userFound,
            token
        })

    } catch (error) {
        return res.status(404).json({
            status: 'error',
            message: 'Error en la comparacion de datos'
        })
    }
}

module.exports = {
    test,
    register,
    login
}