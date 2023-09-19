const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

const { 
    CreateConversation,
    GetConversation
 } = require('../Controllers/ConversationController')

router.post('/Conversation' , jsonParser, CreateConversation);
router.post('/FindConversation' , jsonParser, GetConversation);

module.exports = router;