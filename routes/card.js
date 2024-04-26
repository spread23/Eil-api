const express = require('express')

const CardController = require('../controllers/card')
const check = require('../middlewares/auth')
const uploads = require('../middlewares/upload')

const router = express.Router()

router.get('/test', check.auth, CardController.test)
router.post('/create', check.auth, CardController.createCard)
router.get('/cards', CardController.cards)
router.post('/upload/:id', [check.auth, uploads.single('file0')], CardController.upload)
router.get('/getAvatar/:file', CardController.getAvatar)
router.delete('/delete/:id', check.auth, CardController.deleteCard)

module.exports = router

