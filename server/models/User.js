const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
{
    login : {
        type : String,
        required : true,
        unique : true,
    },
    username : {
        type : String,
        required : true
    }, 
    email : {
        type : String,
        required : true,
        unique : true, 
    },
    password : {
        type : String,
        required : true,
    },
    type : {
        type : String,
        default : 'Regular' // Author, Admin
    },
    profilePicture : {
        type : String,
        default : 'default-pp.jpeg',
    },
}, { timestamps : true });

module.exports = mongoose.model('User', UserSchema);