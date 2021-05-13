const express = require('express');
const router = express.Router();
const Messages = require('../models/Message');
const Users = require('../models/User');
const jwt_decode = require('jwt-decode');
const Authenticate = require('../Utilities/Authenticate');

router.get('/conversation', Authenticate.verifyToken, async (req, res) => {
	if (!(await Authenticate.verifyUserToken(req.token))) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}
	const recipientId = req.body.recipientId;
	const userEmail = jwt_decode(req.token).email;
	const userObject = await Users.findOne({ email: userEmail });
	const userId = userObject.id;

	const messages = [];

	const messagesFromRecipient = await Messages.find({
		senderId: recipientId,
		recipientId: userId,
	});

	const messagesFromUser = await Messages.find({
		senderId: userId,
		recipientId: recipientId,
	});

	const recipientObject = await Users.findOne({ _id: recipientId });
	const recipientName =
		recipientObject.firstName + ' ' + recipientObject.lastName;

	messagesFromRecipient.forEach((message) => {
		message.seen = true;
		message.save().then().catch();
		message.username = recipientName;
		messages.push(message);
	});

	messagesFromUser.forEach((message) => {
		message.username = userObject.firstName + ' ' + userObject.lastName;
		messages.push(message);
	});

	messages.sort((a, b) => {
		return new Date(b.dateRegistered) - new Date(a.dateRegistered);
	});

	res.status(200).json({
		message: 'Conversation received',
		conversation: messages,
	});
});

router.post('/send', Authenticate.verifyToken, async (req, res) => {
	if (!(await Authenticate.verifyUserToken(req.token))) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}
	const recipientId = req.body.recipientId;
	const userEmail = jwt_decode(req.token).email;
	const userObject = await Users.findOne({ email: userEmail });
	const userId = userObject.id;

	const { messageContent } = req.body;

	const message = new Message({
		senderId: userId,
		recipientId: recipientId,
		messageContent,
	});

	const saved = await message.save();
	console.log(saved);
	res.status(200).json({
		message: 'Message saved',
	});
});

router.delete('/deleteMessage', Authenticate.verifyToken, async (req, res) => {
	if (!(await Authenticate.verifyUserToken(req.token))) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}
	await Messages.deleteOne({ _id: req.body.messageId });
	res.status(200).json({
		message: 'Message deleted',
	});
});

module.exports = router;
