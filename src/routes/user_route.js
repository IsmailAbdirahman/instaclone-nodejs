const express = require('express')

const router = express.Router()
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')

const User = require('../model/user_model')
const UserPosts = require('../model/user_posts')



router.post('/users/createAccount', async (req, res) => {
    try {
        const data = req.body
        const user = new User(data)
        await user.save()
        const token = await user.ganerateAuthToken()

        res.status(201).send({ user, token })

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
    res.status(200).send(req.user)
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
            return res.send({ me, userToFollowInfo })
        }

        me.following = me.following.concat(userToFollowID)
        userToFollowInfo.follower = userToFollowInfo.follower.concat(myID)
        await me.save()
        await userToFollowInfo.save()
        res.send({ me, userToFollowInfo })
    } catch (e) {
        res.send(e)
    }
















})






module.exports = router