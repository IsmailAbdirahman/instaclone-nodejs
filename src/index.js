const express = require('express')
const userRouter = require('./routes/user_route')
const userPostsRouter = require('./routes/user_posts')
require('./db/mongoose')

const UserPosts = require('./model/user_posts')
const User = require('./model/user_model')
const { populate } = require('./model/user_posts')



const app = express()

const port = 4000

app.use(express.json())
app.use(userPostsRouter)
app.use(userRouter)













app.listen(port, () => {
    console.log('Server is running:  ', port);
})


const main = async () => {

    // const post = await UserPosts.findById('6352bd6be7d12e90f0119026')
    // await post.populate('author')
    // console.log(post);

    // const user = await User.findById('6352bd5ae7d12e90f0119020')
    // await user.populate('myPosts')
    // console.log(user);



 }

main()



