const express = require('express')

const router = express.Router()
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')

const User = require('../model/user_model')
const UserPosts = require('../model/user_posts')
const UserInfoController = require('../controllers/user_info_controller')
const uploader = require('../controllers/multer_storage')
const cloudinary = require('cloudinary');




router.post('/users/createAccount', uploader.single("file"), async (req, res) => {
    try {

        const upload = await cloudinary.v2.uploader.upload(req.file.path);
        console.log(upload.secure_url);

        const data = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            image: upload.secure_url
        }

        console.log(data);

        const user = new User(data)
        await user.save()
        const token = await user.ganerateAuthToken()

        res.status(201).send(user)

    } catch (e) {
        res.send(e.message)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.ganerateAuthToken()
        res.send({ user, token })

    } catch (error) {
        res.send(error)

    }

})


router.get('/users/myProfile', auth, async (req, res) => {
    try {
        const id = req.user._id

        const profile = await User.findOne({ _id: id }).lean().populate('myPosts')
        delete profile.tokens
        profile.myPosts.map((p) => { delete p.author })


        for(var post of profile.myPosts){
            const likesAsString = post.likes.map((p)=> String(p))
            post.isLiked = likesAsString.includes(String(id))
            post.totalLikes = post.likes.length

        }

        res.send({ profile })

    } catch (error) {
        res.send(error.message)

    }
})


router.get('/users/viewProfile/:id', auth, async (req, res) => {

    try {

        const myID = req.user._id

        const profile = await User.findOne({ _id: req.params.id }).lean().populate('myPosts')
        delete profile.tokens


        for (var post of profile.myPosts) {

            const result = post.likes.map(p => String(p))


            post.isLiked = result.includes(String(myID))

            post.totalLikes = post.likes.length;
        }

        profile.myPosts.map((p) => { delete p.author })

        profile.status = await UserInfoController.profileStatus(req.user._id, req.params.id)


        res.send({ profile })
    } catch (error) {
        res.send(error.message)
    }


})



router.post('/users/search-username', auth, async (req, res) => {
    try {

        const username = req.body.username
        const regex = new RegExp(username, 'i')
        const profile = await User.find({ username: { $regex: regex }, }, 'username image ')
            .limit(6)





        res.send({ profile })

    } catch (error) {

        res.send(error.message)
    }
});



router.get('/users/follow-user/:id', auth, async (req, res) => {
    try {
        const userToFollowID = req.params.id
        const myID = req.user._id
        const me = await User.findOne({ _id: myID })
        const userToFollowInfo = await User.findOne({ _id: userToFollowID })

        if (userToFollowID == myID) {
            return res.send('you can not follow this user')
        }

        if (me.following.includes(userToFollowID)) {
            me.following.pull(userToFollowID)
            userToFollowInfo.follower.pull(myID)
            await me.save()
            await userToFollowInfo.save()
            const userInfo = await User.findOne({ _id: userToFollowID }).lean().populate('myPosts')
            userInfo.status = await UserInfoController.profileStatus(myID, userToFollowID)
            delete userInfo.tokens

            const posts = userInfo.myPosts

            for (var post of posts) {
                const likesAsString = post.likes.map((p) => String(p))

                post.isLiked = likesAsString.includes(String(myID))
                post.totalLikes = post.likes.length

            }


            return res.send({ userInfo })
        }

        me.following = me.following.concat(userToFollowID)
        userToFollowInfo.follower = userToFollowInfo.follower.concat(myID)
        await me.save()
        await userToFollowInfo.save()
        const userInfo = await User.findOne({ _id: userToFollowID }).lean().populate('myPosts')
        userInfo.status = await UserInfoController.profileStatus(myID, userToFollowID)
        delete userInfo.tokens
        const posts = userInfo.myPosts

        for (var post of posts) {
            const likesAsString = post.likes.map((p) => String(p))
            post.isLiked = likesAsString.includes(String(myID))
            post.totalLikes = post.likes.length

        }

        res.send({ userInfo })
    } catch (e) {
        res.send(e)
    }

})


router.post('/users/edit-profile', auth, async (req, res) => {
    try {

        const myID = req.user._id
        const profile = await User.findOne({ _id: myID })

        profile.username = req.body.username
        await profile.save()
        const updatedUsername = await profile.username;

        res.send({ updatedUsername })
    } catch (error) {
        res.send(error)

    }

})





module.exports = router