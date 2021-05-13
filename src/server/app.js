const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

require('dotenv/config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//Importing Routes
const usersRoute = require('./routes/Users');
const adsRoute = require('./routes/Ads');
const categoriesRoute = require('./routes/Categories');
const messagesRoute = require('./routes/Messages');

//Using Imported Routes
app.use('/users', usersRoute);
app.use('/ads', adsRoute);
app.use('/categories', categoriesRoute);
app.use('/messages', messagesRoute);

//Connect to DB
try {
    mongoose.connect(
        process.env.DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log('Connected to Database');
} catch (error) {
    console.log(error)
}

//Initialize Server on port 3000
app.listen(process.env.PORT || 5000);

console.log(`App listening on port: ${process.env.PORT || 5000}`);