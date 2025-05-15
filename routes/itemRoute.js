const { Router } = require('express');
const itemRoute = Router();
const inventoryController = require('../controllers/inventoryController');

itemRoute.get('/', inventoryController.itemList);
itemRoute.get('/category/:categoryName', inventoryController.itemListByCategory);
itemRoute.get('/search', inventoryController.itemSearch);
itemRoute.get('/add', inventoryController.itemCreateGet);
itemRoute.post('/add', inventoryController.itemCreatePost);
itemRoute.get('/:id', inventoryController.itemDetail);
itemRoute.get('/:id/edit', inventoryController.itemEditGet);
itemRoute.post('/:id/edit', inventoryController.itemEditPost);
itemRoute.post('/:id/delete', inventoryController.itemDeletePost);

module.exports = itemRoute;