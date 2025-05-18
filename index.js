const express = require('express');
const index = express();
require('dotenv').config()
const homeRoute = require('./routes/homeRoute');
const itemRoute = require('./routes/itemRoute');

index.set('view engine', 'ejs');
index.use(express.static('public'));
index.use(express.urlencoded({ extended: true }));

index.use('/', homeRoute);
index.use('/items', itemRoute);

const PORT = process.env.PORT || 3000;
index.listen(PORT, () => console.log(`Running on port ${PORT}`));