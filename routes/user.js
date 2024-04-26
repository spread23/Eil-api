const express = require('express')

const UserController = require('../controllers/user')

const router = express.Router()

router.get('/test', UserController.test)
router.post('/register', UserController.register)
router.post('/login', UserController.login)

module.exports = router