const jwt = require('jsonwebtoken')
const User = require('../model/user_model')




const auth = async (req, res, next) => {

    try {
        const headerToken = req.header('Authorization').replace('Bearer ', '')
        const token = headerToken.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {

            throw new Error()
        }

        req.token = token;
        req.user = user
        next()

    } catch (error) {

        res.status(401).send('Please authenticate ')

    }
}



module.exports = auth