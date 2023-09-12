const PostModel = require('../Models/PostModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = "ThisIsVidMeUser";


const GetPostById =  async (Req, Res) => {
    try {        
        const Post = await PostModel.findOne({ _id: Req.params.id });
        console.log(
            Post
        )
        if (!Post) {
            return Res.status(400).json({ Success: false, Message: "Post Not Found" });
        }
        Res.status(200).json({ Success: true, Post });
    } catch (error) {
        return Res.status(400).json({ Error: "An Error Occured" });
    }
}



module.exports = {
    GetPostById
}