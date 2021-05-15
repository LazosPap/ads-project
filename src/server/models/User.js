const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		address: {
			type: String,
		},
		postalCode: {
			type: String,
		},
		phoneNumber: {
			type: String,
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
