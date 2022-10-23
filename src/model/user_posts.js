const mongoose = require('mongoose')
mongoose.pluralize(null);

const postSchema = mongoose.Schema({

    caption: {
        type: String,
        required: true,
    },

    countLikes: {
        type: Number,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    likes: [{


    }]

})





const Post = mongoose.model('Post', postSchema)
module.exports = Post

