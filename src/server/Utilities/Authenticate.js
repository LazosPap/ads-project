const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function hashPassword(password) {
	const saltRounds = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, saltRounds);
}

async function authenticatePassword(password, hashedPassword) {
	return await bcrypt.compare(password, hashedPassword);
}

function verifyToken(req, res, next) {
	//Get Auth Header
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader == 'undefined') {
		return res.status(403);
	}
	//Get Bearer Token
	const bearerToken = bearerHeader.replace('Bearer', '').trim();

	//Set Token
	req.token = bearerToken;
	//Continue to Route
	next();
}

async function userExists(email) {
	return await User.findOne({ email });
}

async function verifyUser(user) {
	const userDB = await User.findOne({ email: user.email });
	if (!userDB) {
		return false;
	}
	const authenticated = await authenticatePassword(
		user.password,
		userDB.password
	);
	return authenticated;
}

function verifyUserToken(token) {
	let authData;
	jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
		authData = decoded;
	});
	return authData;
}
function generatePassword() {
	var length = 12,
		charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		retVal = '';
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

module.exports = {
	hashPassword,
	authenticatePassword,
	verifyToken,
	verifyUserToken,
	verifyUser,
	userExists,
	generatePassword,
};
