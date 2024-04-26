const validator = require('validator')

const validate = (params) => {
    let result = false
    let title = !validator.isEmpty(params.title) && 
                validator.isLength(params.title, {min: 6, max: undefined})

    let description = !validator.isEmpty(params.description) &&
                        validator.isLength(params.description, {min: 10, max: undefined})
    
    let type = !validator.isEmpty(params.type)

    if (!title || !description || !type) {
        throw new Error('Error en la validacion de datos')
    }

    return result
}

module.exports = validate