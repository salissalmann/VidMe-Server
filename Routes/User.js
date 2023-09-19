const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

const { 
    GetAllUsers,
    GetUserbyId
 } = require('../Controllers/UserController');

router.post('/FindUser' , jsonParser, GetUserbyId);
router.post('/FindUserInfo' , jsonParser, GetAllUsers);

module.exports = router;