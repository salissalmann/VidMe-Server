const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const { GetPostById } = require('../Controllers/PostController')

router.get('/:id' , jsonParser , GetPostById);

module.exports = router;