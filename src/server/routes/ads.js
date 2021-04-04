const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const verifyToken = require('./users').verifyToken;

//Create Ad
router.post('/create', verifyToken, async (req, res) => {
	jwt.verify(req.token, 'secretkey', async (err, authData) => {
		if (err) {
			return res.status(403).json({
				message: err,
			});
		}
		const userId = jwt_decode(req.token).id;
		const ad = new Ad({
			userId: userId,
			adType: req.body.adType,
			description: req.body.description,
			title: req.body.title,
			categoryId: req.body.categoryId,
		});

		const newAd = await ad.save();
		res.status(200).json({
			message: 'Ad created',
			newAd,
		});
	});
});

//Update Ad
router.post('/update', verifyToken, async (req, res) => {
	jwt.verify(req.token, 'secretkey', async (err, authData) => {
		if (err) {
			return res.status(403).json({
				message: err,
			});
		}

		const ad = await Ad.findOne({ id: req.body.adId });
		ad.adType = req.body.adType;
		ad.description = req.body.description;
		ad.title = req.body.title;
		ad.categoryId = req.body.categoryId;
		ad.valid = req.body.valid;

		await ad.save();
		res.status(200).json({
			message: 'Ad created',
		});
	});
});

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
router.delete('/deleteAd', async (req, res) => {
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

module.exports = router;
