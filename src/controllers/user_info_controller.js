const User = require('../model/user_model')
const UserPost = require('../model/user_posts')


const profileStatus = async (req, res) => {
  try {
	  let status;
	    const myID = req.user._id
	    const userID = req.params.id
	    const result = await isFollowing(myID, userID)
	    console.log(result);

	    if (result) {
	        return status = 'following'
	    }
	    return status = 'follow'
} catch (error) {
    res.send(error)
}
}

const isFollowing = async (myID, userID) => {
  try {
	  const myProfile = await User.findOne({ _id: myID })
	    const result = await myProfile.following.includes(userID)
	    console.log(myID);
	    return result
} catch (error) {
	res.send(error)
}
}

module.exports = { profileStatus, isFollowing }