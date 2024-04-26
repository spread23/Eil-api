const { Schema, model } = require('mongoose')

const CardSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        default: 'image.png',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model('Card', CardSchema, 'cards')