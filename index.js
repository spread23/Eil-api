const express = require('express')
const cors = require('cors')
const { config } = require('dotenv')

const connection = require('./database/connection')
const UserRouter = require('./routes/user')
const CardRouter = require('./routes/card')

config()
connection()

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Endpoint de prueba'
    })
})

app.use('/api/user/', UserRouter)
app.use('/api/card', CardRouter)

app.listen(port, () => {
    console.log('El server esta escuchando en el puerto ', port)
})