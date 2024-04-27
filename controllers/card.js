const fs = require('fs')
const path = require('path')

const Card = require('../models/card')

const validate = require('../helpers/validateCard')

const test = (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Endpoint de test'
    })
}

const createCard = async (req, res) => {
    const params = req.body

    if (!params.title || !params.description || !params.type) {
        return res.status(404).json({
            status: 'error',
            message: 'Faltan parametros'
        })
    }

    try {

        validate(params)

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error en la validacion',
            error: error.message
        })
    }

    try {

        params.user = req.user.id

        const cardToSave = new Card(params)

        const cardStorage = await cardToSave.save()

        return res.status(201).json({
            status: 'success',
            message: 'Card creada correctamente',
            card: cardStorage
        })

    } catch (error) {
        return res.status(404).json({
            status: 'error',
            message: 'Error en la creacion de la card'
        })
    }
}

const upload = async (req, res) => {

    const id = req.params.id

    if (!req.file) {
        return res.status(404).json({
            status: 'error',
            message: 'La consulta no contiene archivos'
        })
    }

    const image = req.file.originalname
    const imageSplit = image.split('\.')
    const extension = imageSplit[1]

    if (extension != 'jpg' && extension != 'jpeg' &&
        extension != 'png' && extension != 'gif') {

        const filePath = req.file.path
        fs.unlinkSync(filePath)

        return res.status(400).json({
            status: 'La extension no es valida'
        })
    }

    try {
        const cardUploaded = await Card.findByIdAndUpdate({
            _id: id
        }, { image: req.file.filename }, { new: true })

        if (!cardUploaded) {

            const filePath = req.file.path
            fs.unlinkSync(filePath)

            return res.status(400).json({
                status: 'error',
                message: 'No se pudo actualizar la card'
            })
        }

        return res.status(201).json({
            status: 'success',
            message: 'Subiendo archivo de user',
            card: cardUploaded
        })

    } catch (error) {
        const filePath = req.file.path
        fs.unlinkSync(filePath)

        return res.status(404).json({
            status: 'error',
            message: 'Erro al tratar de actualizar la card'
        })
    }
}

const getAvatar = (req, res) => {
    const file = req.params.file
    const filePath = './uploads/avatars/' + file

    fs.stat(filePath, (error, exists) => {
        if (error || !exists) {
            return res.status(400).json({
                status: 'error',
                message: 'El archivo no existe'
            })
        }

        return res.sendFile(path.resolve(filePath))
    })
}

const cards = async (req, res) => {

    try {

        const cards = await Card.find()

        if (!cards) {
            return res.status(404).json({
                status: 'No existen cards con ese id'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Card requeridas',
            cards
        })

    } catch (error) {
        return res.status(404).json({
            status: 'error',
            message: 'Error en la consulta get de cards',
            error: error.message
        })
    }
}

const deleteCard = async (req, res) => {
    const id = req.params.id

    try {

        const cardDeleted = await Card.findByIdAndDelete({
            _id: id
        })

        if (!cardDeleted) {
            return res.status(404).json({
                status: 'No existe card con ese id'
            })
        }

        if (cardDeleted.image !== 'image.png') {
            const file = cardDeleted.image
            const filePath = './uploads/avatars/' + file

            fs.unlinkSync(filePath)
        }

        return res.status(200).json({
            status: 'success',
            message: 'Card eliminada',
            card: cardDeleted
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al eliminar la card'
        })
    }
}

module.exports = {
    test,
    createCard,
    cards,
    upload,
    getAvatar,
    deleteCard
}