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
router.post('/login', async (req, res) => {
	if (!(await Authenticate.verifyUser(req.body))) {
		return res.status(400).json({
			message: 'Could not authenticate user',
		});
	}
	const user = await User.findOne({ email: req.body.email });
	user.logins.push(Date.now());
	await user.save();
	const token = jwt.sign(
		{ email: req.body.email, id: user._id },
		process.env.PRIVATE_KEY
	);
	res.status(200).json({
		message: 'User authenticated',
		token,
		userID: user._id,
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
		const user = await createUser(req.body, file ? true : false);

		// Save User to DB
		const newUser = await user.save(async (err, nu) => {
			if (err) {
				return res.status(500).json({
					error: err,
				});
			}
			if (file) {
				await Utilities.uploadImage(file, nu._id);
			}
		});

		await Utilities.sendEmail(req.body.email, 'register', undefined);
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
	const password = Authenticate.generatePassword();
	const hashedPassword = await Authenticate.hashPassword(password);
	const user = await User.findOne({ email: userEmail });
	if (!user) {
		return res.status(400).json({
			message: 'User not found',
		});
	}

	user.password = hashedPassword;
	await user.save();

	await Utilities.sendEmail(userEmail, 'reset', password);

	res.status(200).json({
		message: 'Email sent to user with Email: ' + userEmail,
	});
});

router.post('/getUserData', async (req, res) => {
	const user = await User.findOne({ _id: req.body.userId });
	res.status(200).json({
		message: 'User authenticated',
		userData: {
			phoneNumber: user.phoneNumber,
			fullName: user.firstName + ' ' + user.lastName,
			postalCode: user.postalCode,
			address: user.address,
		},
	});
});

async function createUser(user, hasFile) {
	return new User({
		firstName: user.firstName || undefined,
		lastName: user.lastName || undefined,
		address: user.address || undefined,
		postalCode: user.postalCode || undefined,
		phoneNumber: user.phoneNumber || undefined,
		email: user.email,
		password: await Authenticate.hashPassword(user.password),
		hasImage: hasFile,
	});
}

module.exports = router;
