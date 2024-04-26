const mongoose = require('mongoose')
const { config } = require('dotenv')

config()
mongoose.set('strictQuery')

const connection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Te has conectado de manera satisfactoria')
    } catch (error) {
        console.log('No se pudo conectar a la base de datos')
    }
}

module.exports = connection