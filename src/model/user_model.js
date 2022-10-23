const mongoose = require('mongoose')
mongoose.pluralize(null);
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }

    ],

})

userSchema.virtual('myPosts',{
    ref:'Post',
    localField:'_id',
    foreignField:'author'

})

userSchema.methods.ganerateAuthToken = async function () {

    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async function (email, password) {

    const user = await User.findOne({ email })
    if (!user) {
        throw ('Unable to Login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw ('Unable to login')
    }
    return user


}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        const hashedPassword = await bcrypt.hash(user.password, 8)
        user.password = hashedPassword
    }

    next()
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    //delete userObject.email
    delete userObject.tokens
    console.log();
    return userObject
}


const User = mongoose.model('User', userSchema)

module.exports = User


