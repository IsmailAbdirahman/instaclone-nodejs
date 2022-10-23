const express = require('express')
const UserPosts = require('../model/user_posts')
const auth = require('../middleware/auth')
const router = express.Router()
const User = require('../model/user_model')


router.post('/userPost/createPost', auth, async (req, res) => {

    try {

        const userID = req.user._id;
        console.log(userID);
        const post = new UserPosts({
            ...req.body,
            'author': userID

        })

        await post.save()
        res.send(post)


    } catch (error) {

    }

})


router.get('/userPost/me', auth, async (req, res) => {

    try {
        const _id = req.user._id

        const user = await User.findById(_id)
        await user.populate('myPosts')
        res.send(user.myPosts)

    } catch (error) {

    }

})

router.delete('/userpost/delete/:id', auth, async (req, res) => {
    try {
        const postID = req.params.id;
        console.log(postID);
        const post = await UserPosts.findOne({ '_id': postID, 'athor': req.user._id })
        console.log(post);
        await post.remove()
        res.send(post)

    } catch (error) {
        res.send(error)

    }
})


router.get('/userpost/likedPost/:id', auth, async (req, res) => {
    try {
        const userID = req.user._id
        const postID = req.params.id
        const postToLike = await UserPosts.findOne({ _id: postID })

        if (postToLike.likes.includes(userID)) {
            postToLike.likes.pull(userID)
            await postToLike.save()
            return res.send(postToLike)
        }

        postToLike.likes = postToLike.likes.concat(userID)

        await postToLike.save()
        res.send(postToLike)


    } catch (error) {
        res.send(error)

    }



})






module.exports = router