const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const User = require('../models/User');
const Ad = require('../models/Ad');
const multer = require('multer');
const upload = multer();
const Authenticate = require('../Utilities/Authenticate');
const Utilities = require('../Utilities/Utilities');

//Login route
router.get('/login', async (req, res) => {
	if (!(await Authenticate.verifyUser(req.body))) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}
	const token = jwt.sign({ email: req.body.email }, process.env.PRIVATE_KEY);
	res.status(200).json({
		message: 'User authenticated',
		token,
	});
});

//Register Route
router.post('/register', upload.single('profilePic'), async (req, res) => {
	try {
		//Check If User Exists
		if (await Authenticate.userExists(req.body.email)) {
			return res.status(400).json({
				message: 'User already exists',
			});
		}

		const { file } = req;

		//Create User Object
		const user = createUser(req.body, file ? true : false);

		// Save User to DB
		const newUser = await user.save(async (err, nu) => {
			await Utilities.uploadImage(file, nu._id);
		});

		await sendEmail(req.body.email, 'register', undefined);
		res.status(200).json(newUser);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
});

//Remove User from DB
router.post('/delete', Authenticate.verifyToken, async (req, res) => {
	if (!(await Authenticate.verifyUserToken(req.token))) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}
	const userToDelete = await User.deleteOne({ email: req.body.email });
	const userId = jwt_decode(req.token).id;

	if (userToDelete) {
		await Ad.deleteMany({ userId: userId });
		res.status(200).json({
			message: 'User removed from DB',
			userToDelete,
		});
	} else {
		res.status(500).json({
			message: 'Something went wrong',
		});
	}
});

router.post(
	'/update',
	[Authenticate.verifyToken, upload.single('profilePic')],
	async (req, res) => {
		const newData = req.body;
		if (!(await Authenticate.verifyUserToken(req.token))) {
			return res.status(401).json({
				message: 'Could not authenticate user',
			});
		}
		const userEmail = jwt_decode(req.token).email;
		const userObject = await User.findOne({ email: userEmail });

		let passwordExists = false;
		const imageExists = req.file ? true : false;

		Object.keys(newData).forEach((property) => {
			if (property == 'password') {
				passwordExists = true;
			}
			userObject[property] = newData[property];
		});

		if (passwordExists) {
			const hashedPassword = await Authenticate.hashPassword(newData.password);
			userObject.password = hashedPassword;
		}

		if (imageExists) {
			await Utilities.uploadImage(req.file, userObject.id);
			userObject.hasImage = file ? true : userObject.hasImage;
		}
		await userObject.save();
		res.status(200).json({
			message: 'User data updated',
		});
	}
);

router.post('/resetPassword', async (req, res) => {
	const userEmail = req.body.email;
	const password = generatePassword();
	const hashedPassword = await Authenticate.hashPassword(password);
	const user = await User.findOne({ email: userEmail });
	if (!user) {
		return res.status(400).json({
			message: 'User not found',
		});
	}

	user.password = hashedPassword;
	await user.save();

	await sendEmail(userEmail, 'reset', password);

	res.status(200).json({
		message: 'Email sent to user with Email: ' + userEmail,
	});
});

async function createUser(user, hasFile) {
	return new User({
		firstName: user.firstName,
		lastName: user.lastName,
		address: user.address,
		postalCode: user.postalCode,
		phoneNumber: user.phoneNumber,
		email: user.email,
		password: await Authenticate.hashPassword(user.password),
		hasImage: hasFile,
	});
}

module.exports = router;
