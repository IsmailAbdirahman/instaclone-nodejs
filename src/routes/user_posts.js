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

        const myPostsList = await User.findOne({ _id: userID })
        myPostsList.myPosts = post._id;
        console.log(myPostsList.myPosts);
        await myPostsList.save()


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
        const post = await UserPosts.findOne({ _id: postID })
        const myProfile = await User.findOne({ _id: userID })

        if (post.likes.includes(userID) && myProfile.likedPosts.includes(postID)) {

            post.likes.pull(userID)
            myProfile.likedPosts.pull(postID)
            await post.save()
            await myProfile.save()
            return res.send(post)
        }

        post.likes = post.likes.concat(userID)
        myProfile.likedPosts = myProfile.likedPosts.concat(postID)
        await post.save()
        await myProfile.save()
        res.send(post)


    } catch (error) {
        res.send(error)

    }

})


router.get('/userpost/getAllPosts', async (req, res) => {
    const postsList = await UserPosts.find({})
    res.send({ postsList });



})

router.get('/userpost/getMyFollowingsPosts', auth, async (req, res) => {

    const myID = req.user._id

    const me = await User.
        findOne({ _id: myID }).
        populate({
            path: 'following', select: 'myPosts username following follower',
            populate: { path: 'myPosts' }
        });


    res.send(me)




})




module.exports = router