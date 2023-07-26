const mongoose = require('mongoose');
const {Schema } = mongoose;

const VidMe_User = new Schema(
    {
        FirstName: 
        {   type: String, required: true },
        LastName:
        {   type: String, required: true },
        Email:
        {   type: String, required: true,},
        Password: 
        {   type: String, required: true},
        Phone:
        {   type: String, required: true },
        ProfilePicture:
        {   type: String, required: false },  
        CoverPicture:
        {   type: String, required: false },
        Followers:
        {   type: Array, required: false },
        Following:
        {   type: Array, required: false },
        Video:
        {   type: Array, required: false },
        Requests:
        {
            type: Array,
        },
        ProfileLink:
        {
            type: String, 
        },
        ProfileStatus:
        {
            type: String,
        },
        timestamp: 
        {
            type: Date,
            default: Date.now,
        },
    }
);
const Users = mongoose.model('Users' , VidMe_User);
module.exports = Users;