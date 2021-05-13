const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const jwt_decode = require('jwt-decode');
const multer = require('multer');
const upload = multer();
const rimraf = require('rimraf');
const Utilities = require('../Utilities/Utilities');
const Authenticate = require('../Utilities/Authenticate');

//Create Ad
router.post(
	'/create',
	[Authenticate.verifyToken, upload.array('images', 5)],
	async (req, res) => {
		if (!(await Authenticate.verifyUserToken(req.token))) {
			return res.status(401).json({
				message: 'Could not authenticate user',
			});
		}
		const images = await Utilities.getImages(req.files);

		const userId = jwt_decode(req.token).id;
		const ad = new Ad({
			userId: userId,
			adType: req.body.adType,
			description: req.body.description,
			title: req.body.title,
			categoryId: req.body.categoryId,
			images: [],
		});

		for (image of images) {
			ad.images.push(image.fileName);
		}

		const newAd = await ad.save(async (err, na) => {
			await Utilities.saveImages(images, na._id);
		});

		res.status(200).json({
			message: 'Ad created',
			newAd,
		});
	}
);

//Update Ad
router.post(
	'/update',
	[Authenticate.verifyToken, upload.array('images', 5)],
	async (req, res) => {
		if (!(await Authenticate.verifyUserToken(req.token))) {
			return res.status(401).json({
				message: 'Could not authenticate user',
			});
		}
		const images = await Utilities.getImages(req.files);

		const ad = await Ad.findOne({ _id: req.body.adId });
		ad.adType = req.body.adType;
		ad.description = req.body.description;
		ad.title = req.body.title;
		ad.categoryId = req.body.categoryId;
		ad.valid = req.body.valid;
		ad.images = [];

		for (image of images) {
			ad.images.push(image.fileName);
		}

		await ad.save(async (err, na) => {
			rimraf.sync(`${__dirname}/../public/adImages/${ad.id}/`);
			await Utilities.saveImages(images, na._id);
		});

		res.status(200).json({
			message: 'Ad updated',
		});
	}
);

//Get Data for One Ad
router.get('/getOne', async (req, res) => {
	try {
		const adData = await Ad.findOne({ id: req.body.adId });
		res.status(200).json(adData);
	} catch (err) {
		res.status(400).json({
			message: err,
		});
	}
});

//Get Data for All Ads or By Category
router.get('/getAds', async (req, res) => {
	try {
		let query = Ad.find();
		if (req.body.categoryId) {
			query = Ad.find({ categoryId: req.body.categoryId });
		}

		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.limit) || 20;
		const skip = (page - 1) * pageSize;
		const total = await Ad.countDocuments();

		const pages = Math.ceil(total / pageSize);

		query = query.skip(skip).limit(pageSize);

		const adData = await query;

		res.status(200).json({
			count: adData.length,
			page,
			pages,
			data: adData,
		});
	} catch (err) {
		res.status(500).json({
			message: err,
		});
	}
});

//Delete Ad
router.delete('/deleteAd', Authenticate.verifyToken, async (req, res) => {
	if (!(await Authenticate.verifyUserToken(req.token))) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}
	try {
		await Ad.deleteOne({ id: req.body.adId });
		res.status(200).json({
			message: 'Ad deleted',
		});
	} catch (err) {
		res.status(400).json({
			message: err,
		});
	}
});

router.get('/search', (req, res) => {
	const { pattern } = req.body;
	Ad.aggregate([
		{
			$search: {
				index: 'default',
				compound: {
					should: [
						{
							text: {
								query: pattern,
								path: 'title',
								fuzzy: {
									maxEdits: 1,
									maxExpansions: 100,
								},
								score: {
									boost: {
										value: 5,
									},
								},
							},
						},
						{
							text: {
								query: pattern,
								path: 'description',
								fuzzy: {
									maxEdits: 1,
									maxExpansions: 100,
								},
							},
						},
					],
				},
			},
		},
		{
			$project: {
				title: 1,
				description: 1,
				images: 1,
				categoryId: 1,
				dateRegistered: 1,
				valid: 1,
				score: {
					$meta: 'searchScore',
				},
			},
		},
	])
		.then((result) => {
			res.status(200).json({
				result,
			});
		})
		.catch((err) => {
			res.status(500).json({ err });
		});
});

module.exports = router;
