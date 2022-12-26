const express = require('express')

const router = express.Router()
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')

const User = require('../model/user_model')
const UserPosts = require('../model/user_posts')
const UserInfoController = require('../controllers/user_info_controller')



router.post('/users/createAccount', async (req, res) => {
    try {
        const data = req.body
        const user = new User(data)
        await user.save()
        const token = await user.ganerateAuthToken()

        res.status(201).send(user)

    } catch (e) {
        res.send(e)
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
        const _id = req.user._id

        const user = await User.findById(_id)
        await user.populate('myPosts')

        const profile = await User.findOne(_id)
        const posts = user.myPosts;


        res.send({ profile, posts })

    } catch (error) {
        res.send(error)

    }
})


router.get('/users/viewProfile/:id', auth, async (req, res) => {
    try {
        const profile = await User.findOne({ _id: req.params.id })
        await profile.populate('myPosts')
        const posts = profile.myPosts

        const status = await UserInfoController.profileStatus(req, res)
        res.send({ profile, posts, status })
    } catch (error) {
        res.send(error)
    }


})



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
            const status = await UserInfoController.profileStatus(req, res)

            return res.send({ status })
        }

        me.following = me.following.concat(userToFollowID)
        userToFollowInfo.follower = userToFollowInfo.follower.concat(myID)
        await me.save()
        await userToFollowInfo.save()
        const status = await UserInfoController.profileStatus(req, res)

        res.send({ status })
    } catch (e) {
        res.send(e)
    }

})


router.post('/users/edit-profile', auth, async (req, res) => {
    try {
        const myID = req.user._id
        const me = await User.findOne({ _id: myID })

        me.username = req.params.username
        me.password = req.params.password
        res.send(me)

        await User.save()
    } catch (error) {
        res.send(error)

    }



})


module.exports = router