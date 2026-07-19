require('dotenv').config();

const express = require('express');
const app = express();

const userRoute = require('./routes/userRoutes');
const newsRoute = require('./routes/newsRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoute);
app.use('/news', newsRoute);

module.exports = app;