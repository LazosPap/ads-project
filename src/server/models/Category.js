const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
	{
		categoryName: {
			type: String,
			required: true,
		},
		childCategories: [
			{
				type: mongoose.ObjectId,
			},
		],
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('Categories', CategorySchema);
