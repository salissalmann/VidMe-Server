const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const { UserLogin , CreateAccount } = require('../Controllers/AuthController')

router.post('/login' , jsonParser , UserLogin);
router.post('/create-account' , jsonParser , CreateAccount);

module.exports = router;