const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const Categories = require('../models/Category');

router.get('/', async (req, res) => {
	try {
		const categories = await Categories.find();
		res.status(200).json(categories);
	} catch (err) {
		res.status(400).json({
			message: err,
		});
	}
});

router.post('/', async (req, res) => {
	const {categoryName, parentCategoryName} = req.body.category;
	if (!req.body.category) {
		return res.status(500).json({
			message: 'Categories object is empty',
		});
	}

	const categoryExists = await Categories.findOne({
		categoryName: categoryName,
    });
    if (categoryExists) {
        return res.status(500).json({
            message: "Category already exists"
        })
    }

	const newCategory = new Category({
		categoryName: categoryName,
	});
	const savedCategory = await newCategory.save();
	const savedCategoryId = savedCategory._id;

	if (parentCategoryName) {
		const categoryParent = await Categories.findOne({
			categoryName: parentCategoryName,
		});
		categoryParent.childCategories.push(savedCategoryId);
		await categoryParent.save();
	}

	return res.status(200).json({
		message: 'Category saved',
	});
});

module.exports = router;
