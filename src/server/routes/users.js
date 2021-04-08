const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const User = require('../models/User');
const Ad = require('../models/Ad');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const upload = multer();

//Login route
router.get('/login', async (req, res) => {
	// Get User Data
	const clientUser = req.body.user;
	const dbUser = await User.findOne({ email: clientUser.email });

	//Error message if user not exists
	if (dbUser == null) {
		return res.status(400).send('User not found!');
	}

	//Compare Hashed Passwords
	if (await bcrypt.compare(clientUser.password, dbUser.password)) {
		jwt.sign(
			{ email: clientUser.email, id: dbUser.id },
			'secretkey',
			{ expiresIn: '2 days' },
			async (err, token) => {
				if (err) {
					return res.status(400).json({
						message: err,
					});
				}
				dbUser.logins.push(Date.now());
				await dbUser.save();
				res.json({
					message: 'User authenticated',
					token,
				});
			}
		);
	} else {
		res.send('Unauthenticated User');
	}
});

//Register Route
router.post('/register', upload.single('profilePic'), async (req, res) => {
	try {
		//Check If User Exists
		const userExists = await User.findOne({ email: req.body.email });
		const { file } = req;

		if (userExists) {
			return res.status(401).json({
				message: 'User with such email already exists!',
			});
		}

		//Hashing Password
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		//Create User Object
		const user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			address: req.body.address,
			postalCode: req.body.postalCode,
			phoneNumber: req.body.phoneNumber,
			email: req.body.email,
			password: hashedPassword,
			hasImage: file ? true : false,
		});

		// Save User to DB
		const newUser = await user.save(async (err, nu) => {
			await uploadImage(file, nu._id);
		});

		await sendEmail(
			req.body.email,
			'Επιτυχής Εγγραφή',
			"<p>Επιτυχής Εγγραφή στη Σελίδα <a href='localhost:3000/'>Adopse Ads</a></p>"
		);
		res.json(newUser);
	} catch (error) {
		console.log(error);
		res.json({ message: error });
	}
});

//Remove User from DB
router.post('/delete', verifyToken, async (req, res) => {
	const userEmail = req.body.email;
	jwt.verify(req.token, 'secretkey', async (err, authData) => {
		if (err) {
			return res.status(403).json({
				message: err,
			});
		}

		const userToDelete = await User.deleteOne({ email: userEmail });
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
});

router.post(
	'/update',
	[verifyToken, upload.single('profilePic')],
	async (req, res) => {
		const newData = req.body;
		jwt.verify(req.token, 'secretkey', async (err, authData) => {
			if (err) {
				return res.status(403).json({
					message: err,
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
				const salt = await bcrypt.genSalt();
				const hashedPassword = await bcrypt.hash(newData.password, salt);
				userObject.password = hashedPassword;
			}

			if (imageExists) {
				await uploadImage(req.file, userObject.id);
				userObject.hasImage = file ? true: userObject.hasImage;
			}
			await userObject.save();
			res.status(200).json({
				message: 'User updated',
			});
		});
	}
);

router.post('/resetPassword', async (req, res) => {
	const userEmail = req.body.email;
	const password = generatePassword();
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);
	const user = await User.findOne({ email: userEmail });
	if (!user) {
		return res.status(400).json({
			message: 'user not found',
		});
	}

	user.password = hashedPassword;
	await user.save();

	const messageBody = `<h1>Ο κωδικός άλλαξε επιτυχώς</h1>
<br>
<h2>Ο καινούργιος κωδικός για την ιστοσελίδα μας <a href="">Adopse Ads</a> είναι</h2>
<p style="font-weight: 500;">${password}</p>`;

	await sendEmail(userEmail, 'Ο Κωδικός Άλλαξε Επιτυχώς', messageBody);

	res.status(200).json({
		message: 'Email sent to user with Email: ' + userEmail,
	});
});

async function sendEmail(recipientEmail, subject, htmlBody) {
	const transporter = nodemailer.createTransport({
		host: 'smtp.mail.yahoo.com',
		port: 465,
		secure: true,
		auth: {
			user: 'adopse_ads',
			pass: 'tuaxepuepaixomdj',
		},
	});

	await transporter.sendMail({
		from: '"Adopse Ads 🔑" <adopse_ads@yahoo.com>',
		to: recipientEmail,
		subject: subject,
		html: htmlBody,
	});
}

//Verify JWT
function verifyToken(req, res, next) {
	//Get Auth Header
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader == 'undefined') {
		return res.status(403);
	}
	//Get Bearer Token
	const bearer = bearerHeader.split(' ');
	const bearerToken = bearer[1];

	//Set Token
	req.token = bearerToken;

	//Continue to Route
	next();
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

async function uploadImage(file, userId) {
	try {
		fs.unlinkSync(`${__dirname}/../public/userImages/${userId}.jpg`);
		fs.unlinkSync(`${__dirname}/../public/userImages/${userId}.png`);
		fs.unlinkSync(`${__dirname}/../public/userImages/${userId}.jpeg`);
	} catch (e) {
		console.log(e);
	}

	const extension = file.detectedFileExtension;
	if (extension == '.png' || extension == '.jpg' || extension == '.jpeg') {
		await pipeline(
			file.stream,
			fs.createWriteStream(
				`${__dirname}/../public/userImages/${userId}${extension}`
			)
		);
	}
}

module.exports = {
	router: router,
	verifyToken: verifyToken,
	sendEmail: sendEmail,
};
