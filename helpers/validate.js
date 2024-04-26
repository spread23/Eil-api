const validator = require('validator')

const validate = (params) => {
    let result = true
    let name = !validator.isEmpty(params.name) && 
                validator.isLength(params.name, {min: 5, max: undefined}) &&
                validator.isAlpha(params.name, 'es-ES')

    let nick = !validator.isEmpty(params.nick) &&
                validator.isLength(params.nick, {min: 4, max: 20})

    let email = !validator.isEmpty(params.email) &&
                validator.isEmail(params.email)

    let password = !validator.isEmpty(params.password)

    if (!name || !nick || !email || !password) {
        throw new Error('Error en la validacion de datos')
        result = false
    }

    return result
}

module.exports = validate