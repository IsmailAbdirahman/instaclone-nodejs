const express = require('express')
const userRouter = require('./routes/user_info')
const userPostsRouter = require('./routes/user_posts')
require('./db/mongoose')
//const mongoose = require('mongoose')

const UserPosts = require('./model/user_posts')
const User = require('./model/user_model')
const { populate } = require('./model/user_posts')


// var bodyParser = require('body-parser');
// const cors = require('cors');
// var fs = require('fs');
// var path = require('path');
// var multer = require('multer');
// var cloudinary = require('cloudinary').v2;
// require('dotenv/config');



// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET
// });


// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });



//----------------------------------------------------------------------------------//
const app = express()

const PORT = process.env.PORT ||4000

app.use(express.json())
app.use(userPostsRouter)
app.use(userRouter)
//----------------------------------------------------------------------------------//

// var upload = multer({ storage: storage });
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())



// app.post('/', upload.single('image'), (req, res, next) => {

//     const data = {
//      image: req.file.path
//     }
//     cloudinary.uploader.upload(data.image)
//     .then((result)=>{
//      const image = new UserPosts({
//             img: result.url
//         });
//         const response = image.save();
//      res.status(200).send({
//       message: "success",
//       result
//      });
//     }).catch((error) => {
//      res.status(500).send({
//       message: "failure",
//       error
//      });
//     });
// });


// mongoose.connect(process.env.MONGO_URL,
//     { useNewUrlParser: true, useUnifiedTopology: true }, err => {
//         console.log('connected')
//     });























app.listen(PORT, () => {
    console.log('Server is running:  ', PORT);
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



