const mongoose = require('mongoose')
mongoose.pluralize(null);

var fs = require('fs');
var path = require('path');

const postSchema = mongoose.Schema({

    image: {
        type: String
    },

    caption: {
        type: String,
        required: true,
    },


    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    image: {
        type: String
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

},
    {
        timestamps: true,
    }
)





const Post = mongoose.model('Post', postSchema)
module.exports = Post

