const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

require('dotenv/config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//Importing Routes
const usersRoute = require('./routes/users').router;
const adsRoute = require('./routes/ads');
const categoriesRoute = require('./routes/categories');
const messagesRoute = require('./routes/messages');

//Using Imported Routes
app.use('/users', usersRoute);
app.use('/ads', adsRoute);
app.use('/categories', categoriesRoute);
app.use('/messages', messagesRoute);

//Connect to DB
mongoose.connect(
	process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

//Initialize Server on port 3000
app.listen(3000);

console.log("App listening on port 3000");