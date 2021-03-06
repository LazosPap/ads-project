const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

router.get('/getAll', async (req, res) => {
	try {
		const categories = await Category.find();
		res.status(200).json(categories);
	} catch (err) {
		res.status(400).json({
			message: err,
		});
	}
});

router.post('/create', async (req, res) => {
	const {categoryName, parentCategory} = req.body.category;
	if (!req.body.category) {
		return res.status(500).json({
			message: 'Categories object is empty',
		});
	}

	const categoryExists = await Category.findOne({
		categoryName: categoryName,
    });
    if (categoryExists) {
        return res.status(500).json({
            message: "Category already exists"
        })
    }

	const newCategory = new Category({
		categoryName: categoryName,
		parent: parentCategory
	});
	const savedCategory = await newCategory.save();
	const savedCategoryId = savedCategory._id;

	return res.status(200).json({
		message: 'Category saved',
		savedCategory,
		savedCategoryId
	});
});

module.exports = router;
