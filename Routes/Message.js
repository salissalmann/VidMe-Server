const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

const { 
    CreateMessage,
    FindMessage
 } = require('../Controllers/MessageController')

router.post('/initiate' , jsonParser, CreateMessage);
router.post('/FindConnection' , jsonParser, FindMessage);

module.exports = router;