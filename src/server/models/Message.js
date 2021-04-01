const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
	{
		messageContent: {
			type: String,
			required: true,
		},
		senderId: {
			type: mongoose.ObjectId,
			required: true,
		},
		recipientId: {
			type: mongoose.ObjectId,
			required: true,
		},
		seen: {
			type: Boolean,
			required: true,
			default: false,
		},
		dateRegistered: {
			type: Date,
			default: Date.now,
		},
		username: {
			type: String,
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('Messages', MessageSchema);
