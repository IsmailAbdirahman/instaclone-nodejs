const User = require('../model/user_model')
const UserPost = require('../model/user_posts')


const profileStatus = async (myID, userID) => {
	try {
		let status = "follow";

		const result = await isFollowing(myID, userID)
		console.log("The result is: ", result);

		if (myID == userID) {
			return status = null
		}

		if (result) {
			return status = 'following'
		}
		return status = 'follow'
	} catch (error) {
		return 'Something went Wrong'
	}
}

const isFollowing = async (myID, userID) => {
	try {
		const myProfile = await User.findOne({ _id: myID })
		const result = await myProfile.following.includes(userID)
		console.log('----------------', result);
		return result
	} catch (error) {
		res.send(error)
	}
}

module.exports = { profileStatus, isFollowing }