const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { verifyToken } = require('./users');
const mkdirp = require('mkdirp');
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const rimraf = require('rimraf');

//Create Ad
router.post(
	'/create',
	[verifyToken, upload.array('images', 5)],
	async (req, res) => {
		jwt.verify(req.token, 'secretkey', async (err, authData) => {
			if (err) {
				return res.status(403).json({
					message: err,
				});
			}

			const images = await getImages(req.files);

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
				await saveImages(images, na._id);
			});

			res.status(200).json({
				message: 'Ad created',
				newAd,
			});
		});
	}
);

//Update Ad
router.post(
	'/update',
	[verifyToken, upload.array('images', 5)],
	async (req, res) => {
		jwt.verify(req.token, 'secretkey', async (err, authData) => {
			if (err) {
				return res.status(403).json({
					message: err,
				});
			}

			const images = await getImages(req.files);

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
				await saveImages(images, na._id);
			});

			res.status(200).json({
				message: 'Ad updated',
			});
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

//Get Data for All Ads
router.get('/getAll', async (req, res) => {
	try {
		const adData = await Ad.find();
		res.status(200).json(adData);
	} catch (err) {
		res.status(400).json({
			message: err,
		});
	}
});

//Get Data for Ad In Specific Category
router.get('/getByCategory', async (req, res) => {
	try {
		const adData = await Ad.find({ categoryId: req.body.categoryId });
		res.status(200).json(adData);
	} catch (err) {
		res.status(400).json({
			message: err,
		});
	}
});

//Delete Ad
router.delete('/deleteAd', verifyToken, async (req, res) => {
	jwt.verify(req.token, 'secretkey', async (err, authData) => {
		if (err) {
			return res.status(403).json({
				message: err,
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

async function getImages(files) {
	const images = new Array();

	for (image of files) {
		const imageObject = {
			fileName: image.originalName,
			stream: image.stream,
		};
		images.push(imageObject);
	}

	return images;
}

async function saveImages(images, adId) {
	for (image of images) {
		mkdirp.sync(`${__dirname}/../public/adImages/${adId}/`);
		await pipeline(
			image.stream,
			fs.createWriteStream(
				`${__dirname}/../public/adImages/${adId}/${image.fileName}`
			)
		);
	}
}

module.exports = router;
