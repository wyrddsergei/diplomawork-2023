const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
{  
    title : {
        type : String,
        required : true,
        unique : true,
    },
    contents : {
        type : String,
        required : true,
    }, 
    coverImage : {
        type : String,
        required : false,
    },
    createdBy : {
        type : String,
        required : true,    
    },
    categories : {
        type : Array,
        required : false,
    },
}, { timestamps : true });

module.exports = mongoose.model('Post', PostSchema);