const mongoose = require('mongoose');

const AdSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.ObjectId,
			required: true,
		},
		adType: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		categoryId: {
			type: mongoose.ObjectId,
			required: true,
		},
		dateRegistered: {
			type: Date,
			default: Date.now,
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('Ad', AdSchema);
