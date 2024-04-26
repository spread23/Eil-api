const jwt = require('jwt-simple')
const moment = require('moment')
const { config } = require('dotenv')

const secret_key = process.env.SECRET_KEY

const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        nick: user.nick,
        email: user.email,
        password: user.password,
        iat: moment().unix(),
        exp: moment().add(30, 'days')
    }

    return jwt.encode(payload, secret_key)
}

module.exports = {
    createToken,
    secret_key
}