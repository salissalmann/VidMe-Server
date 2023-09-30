const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

const { 
    GetAllUsers,
    GetUserbyId,
    SetVerified
 } = require('../Controllers/UserController');

router.post('/FindUser' , jsonParser, GetUserbyId);
router.post('/FindUserInfo' , jsonParser, GetAllUsers);
router.put('/UpdateVerification' , jsonParser, SetVerified);

module.exports = router;