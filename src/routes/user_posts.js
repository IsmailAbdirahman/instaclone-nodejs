const express = require('express')
const UserPosts = require('../model/user_posts')
const auth = require('../middleware/auth')
const router = express.Router()
const User = require('../model/user_model')
const cloudinary = require('cloudinary');
const uploader = require('../controllers/multer_storage')
const UserInfoController = require('../controllers/user_info_controller')




router.post('/userPost/createPost', uploader.single('file'), auth, async (req, res) => {

    try {
        const upload = await cloudinary.v2.uploader.upload(req.file.path);

        const userID = req.user._id;
        const post = new UserPosts({
            'caption': req.body.caption,
            'image': upload.secure_url,
            'author': userID

        })

        const myPostsList = await User.findOne({ _id: userID })
        myPostsList.myPosts = post._id;
        console.log(myPostsList.myPosts);
        await myPostsList.save()


        await post.save()
        res.send(post)


    } catch (error) {
        res.send(error)

    }

})


router.get('/userPost/me', auth, async (req, res) => {

    try {
        const _id = req.user._id

        const user = await User.findById(_id)
        await user.populate('myPosts')

        const prfile = await User.findOne(_id)
        const myPosts = user.myPosts;
        res.send({ myPosts })

    } catch (error) {
        res.send(error)
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
            await post.populate('author')
            await myProfile.save()
            return res.send(post)
        }

        post.likes = post.likes.concat(userID)
        myProfile.likedPosts = myProfile.likedPosts.concat(postID)
        await post.save()
        await post.populate('author')

        await myProfile.save()
        res.send(post)


    } catch (error) {
        res.send(error)

    }

})


router.get('/userpost/getAllPosts', async (req, res) => {
    try {
        const postsList = await UserPosts.find({})
        res.send({ postsList });
    } catch (error) {
        res.send(error)
    }



})

router.get('/userpost/getMyFollowingsPosts', auth, async (req, res) => {

    try {
        const myID = req.user._id


        const myPosts = await UserPosts.find(
            { author: { $in: myID } })
            .populate({
                path: 'author', select: 'username image'
            })
            .sort({ 'createdAt': -1 })


        const myFollowingPosts = await UserPosts.find(
            { author: { $in: req.user.following } })
            .populate({
                path: 'author', select: 'username image'
            })
            .sort({ 'createdAt': -1 })


        const posts = myPosts.concat(myFollowingPosts)
        res.send(posts)
    } catch (error) {
        res.send('something went wrong')

    }

})

router.get('/users/getMyFollowingProfile', auth, async (req, res) => {
    try {
        const followingProfiles = await User.find({ _id: { $in: req.user.following } })
        res.send(followingProfiles)
    } catch (error) {
        res.send(error)
    }

})

router.get('/users/getSingleUserFollowingProfiles/:id', auth, async (req, res) => {
    try {
        const profileList = [];
        const userId = req.params.id
        const user = await User.findOne({ _id: userId }).lean()
        const result = await User.find({ _id: { $in: user.following } }).lean().populate('myPosts')

        for (var userInfo of result) {
            delete userInfo.tokens
            delete userInfo.myPosts.map((p) => { delete p.author })
            userInfo.status = await UserInfoController.profileStatus(req.user._id, userInfo._id)
            profileList.push(userInfo)
        }

        res.send({ profileList })

    } catch (error) {
        res.send(error.message)

    }
})


router.get('/users/getSingleUserFollowerProfiles/:id', auth, async (req, res) => {
    try {
        const profileList = [];
        const userId = req.params.id

        const user = await User.findOne({ _id: userId })

        const result = await User.find({ _id: { $in: user.follower } }).lean().populate('myPosts')
        for (var userInfo of result) {
            delete userInfo.tokens
            delete userInfo.myPosts.map((p) => { delete p.author })

            userInfo.status = await UserInfoController.profileStatus(req.user._id, userInfo._id)
            profileList.push(userInfo)
        }

        res.send({ profileList })

    } catch (error) {
        res.send({ error })

    }
})



router.post("/users/upload", uploader.single("file"), async (req, res) => {
    const upload = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(upload);
    return res.send({
        success: true,
        image: upload.secure_url,
    });
});



module.exports = router

///TODO: Fix getting list of Following, To Fix:  Add Populate('myPosts) of following  LINE: 165