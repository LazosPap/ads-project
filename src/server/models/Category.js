const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
	{
		categoryName: {
			type: String
		},
		parent: {
			type: String,
		}
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('Categories', CategorySchema);
