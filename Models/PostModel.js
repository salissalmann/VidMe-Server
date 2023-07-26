const mongoose = require('mongoose');
const {Schema } = mongoose;



const Post = new Schema(
    {
        Email: { type: String, required: true },
        UserLink: { type: String, required: true},
        PostText: { type: String, required: false},
        PostImage: { type: String, required: false},
        PostVideo: { type: String, required: false},
        Likes: {
            type: Array,
        },
        Comments: {
            type: Object
        },
        Keywords: {
            type: Array
        },
        timestamp:
        {
            type: Date,
            default: Date.now,
        },
    }
);
const Posts = mongoose.model('Posts' , Post);
module.exports = Posts;
