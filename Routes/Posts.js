const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const GetToken = require('../Middleware/GetToken')

const { 
    GetPostById,
    AddComment,
    GetCommentsByPostId,
    AddReply
 } = require('../Controllers/PostController')

router.get('/:id' , jsonParser , GetPostById);
router.post('/addComment' , GetToken ,  jsonParser , AddComment)
router.post('/getCommentsById' , jsonParser , GetCommentsByPostId)
router.post('/replyToComment' ,  GetToken , jsonParser , AddReply )


module.exports = router;