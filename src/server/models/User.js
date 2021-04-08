const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		postalCode: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		logins: [
			{
				type: Date,
			}
		],
		dateRegistered: {
			type: Date,
			default: Date.now,
		},
		hasImage: {
			type: Boolean
		}
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('Users', UserSchema);
