const { Router } = require('express');
const homeRoute = Router();
const inventoryController = require('../controllers/inventoryController')

homeRoute.get('/', inventoryController.home);

module.exports = homeRoute;