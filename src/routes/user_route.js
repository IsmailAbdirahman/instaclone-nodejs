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






module.exports = router