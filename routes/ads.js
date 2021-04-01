const express = require('express');
const router = express.Router();
const Ads = require('../models/Ad');
const Categories = require('../models/Category');
const jwt = require('jsonwebtoken');
const verifyToken = require('./users').verifyToken;
const Category = require('../models/Category');



module.exports = router;
