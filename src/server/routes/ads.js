const express = require('express');
const router = express.Router();
const Ads = require('../models/Ad');
const jwt = require('jsonwebtoken');
const verifyToken = require('./users').verifyToken;
const Category = require('../models/Category');


//Get Data for One Ad
router.get('/getOne', async (req, res) => {
    
})

module.exports = router;
