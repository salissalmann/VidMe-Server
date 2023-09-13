const PostModel = require('../Models/PostModel')
const CommentModel = require("../Models/CommentModel")
const UserModel = require("../Models/UserModel")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = "ThisIsVidMeUser";


const GetPostById =  async (Req, Res) => {
    try {        
        const Post = await PostModel.findOne({ _id: Req.params.id });
        if (!Post) {
            return Res.status(400).json({ Success: false, Message: "Post Not Found" });
        }
        Res.status(200).json({ Success: true, Post });
    } catch (error) {
        return Res.status(400).json({ Error: "An Error Occured" });
    }
}

const AddComment = async (req, res) => {
    try {
        const User = await UserModel.findOne({ _id: req.user.id });

        if (!User) {
            return res.status(400).json({ Success: false, Message: "User Not Found" });
        }

        const Post = await PostModel.findOne({ _id: req.body.PostId });
        if (!Post) {
            return res.status(400).json({ Success: false, Message: "Post Not Found" });
        }

        const Comment = new CommentModel({
            PostId: req.body.PostId,
            Name: User.FirstName + " " + User.LastName,
            ProfilePicture: User.ProfilePicture,
            UserLink: User.ProfileLink,
            CommentText: req.body.CommentText,
        });

        const AddedComment = await Comment.save();
        Post.Comments.push(AddedComment._id);
        const UpdatedPost = await Post.save();
        res.status(200).json({ Success: true, Message: "Comment Added Successfully", UpdatedPost });
    } catch (error) {
        console.error(error); 
        return res.status(400).json({ Message: "An Error Occurred" });
    }
}

const GetCommentsByPostId = async (req, res) => {
    try {
        const Post = await PostModel.findById(
            req.body.id
        )
        if (!Post) {
            return res.status(400).json({ Success: false, Message: "Post Not Found" });
        }

        const CommentIDs = Post.Comments;

        const Comments = await CommentModel.find({ _id: { $in: CommentIDs } });
        if (!Comments) {
            return res.status(400).json({ Success: false, Message: "Comments Not Found" });
        }
 
        res.status(200).json({ Success: true, Comments });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ Message: "An Error Occurred" });
    }
}

const AddReply = async (req, res) => {
    try {
        const User = await UserModel.findOne({ _id: req.user.id });
        console.log(User.Email)
        if(!User){
            return res.status(400).json({ Success: false, Message: "User Not Found" });
        }

        const Comment = await CommentModel.findById(req.body.CommentId)
        if(!Comment){
            return res.status(400).json({ Success: false, Message: "Comment Not Found" });
        }

        const Reply = {
            Name: User.FirstName + " " + User.LastName,
            ProfilePicture: User.ProfilePicture,
            UserLink: User.ProfileLink,
            ReplyText: req.body.ReplyText,
        }

        Comment.Replies.push(Reply);
        const UpdatedComment = await Comment.save();
        res.status(200).json({ Success: true, Message: "Reply Added Successfully", UpdatedComment });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ Message: "An Error Occurred" });
    }
}

module.exports = {
    GetPostById,
    AddComment,
    GetCommentsByPostId,
    AddReply
}