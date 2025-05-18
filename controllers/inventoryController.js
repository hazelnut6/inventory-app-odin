const pool = require('../db/pool');


exports.home = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT i.id, i.name, i.description, c.name AS category, i.price, i.quantity FROM items AS i INNER JOIN categories AS c ON i.category_id = c.id ORDER BY i.name ASC;');
        const items = result.rows;
        const categoriesResult = await client.query('SELECT name FROM categories ORDER BY name ASC;');
        const categories = categoriesResult.rows;
        client.release();
        res.render('home', { title: 'Home', items: items,  categories: categories });
    } catch(err) {
        console.error('Error fetching items:', err);
        res.status(500).send('Error fetching inventory items');
    }
};

exports.itemList = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT i.id, i.name, i.description, c.name AS category, i.price, i.quantity FROM items AS i INNER JOIN categories AS c ON i.category_id = c.id ORDER BY i.name ASC;');
        const items = result.rows;
        const categoriesResult = await client.query('SELECT name FROM categories ORDER BY name ASC;');
        const categories = categoriesResult.rows;
        client.release();
        res.render('items', { title: 'All items', items: items, categories: categories, request: req });
    } catch(err) {
        console.error('Error fetching items:', err);
        res.status(500).send('Error fetching inventory items');
    }
};

exports.itemListByCategory = async (req, res) => {
    const categoryName = req.params.categoryName;

    try {
        const client = await pool.connect();
        const query = 'SELECT i.id, i.name, i.description, c.name AS category, i.price, i.quantity FROM items i INNER JOIN categories c ON i.category_id = c.id WHERE c.name = $1 ORDER BY i.name ASC;';
        const result = await client.query(query, [categoryName]);
        const items = result.rows;
        const categoriesResult = await client.query('SELECT name FROM categories ORDER BY name ASC;');
        const categories = categoriesResult.rows;
        client.release();
        res.render('items', { items: items, title: `${categoryName} items`, categories: categories, request: req });
    } catch(err) {
        console.error(`Error fetching items in category ${categoryName}:`, err);
        res.status(500).send(`Error fetching items in ${categoryName}`);
    }
};

exports.itemSearch = async (req, res) => {
    const searchTerm = req.query.q;

    try {
        const client = await pool.connect();
        const query = 'SELECT i.id, i.name, i.description, c.name AS category, i.price, i.quantity FROM items i INNER JOIN categories c ON i.category_id = c.id WHERE LOWER(i.name) LIKE LOWER($1) OR LOWER(i.description) LIKE LOWER($1) ORDER BY i.name ASC;';
        const result = await client.query(query, [`%${searchTerm}%`]);
        const items = result.rows;
        const categoriesResult = await client.query('SELECT name FROM categories ORDER BY name ASC;');
        const categories = categoriesResult.rows;
        client.release();
        res.render('items', { items: items, title: `Result for: "${searchTerm}"`, categories: categories, request: req });
    } catch(err) {
        console.error('Error searching items:', err);
        res.status(500).send('Error searching inventory items');
    }
};

exports.itemCreateGet = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT id, name FROM categories ORDER BY name ASC;');
        const categories = result.rows;
        client.release();
        res.render('add-item', { title: 'Add item', categories: categories });
    } catch(err) {
        console.error('Error fetching categories for add item form:', err);
        res.status(500).send('Error fetching categories');
    }
};

exports.itemCreatePost = async (req, res) => {
    const { name, description, category_id, price, quantity } = req.body;

    try {
        const client = await pool.connect();
        const query = 'INSERT INTO items (name, description, category_id, price, quantity) VALUES ($1, $2, $3, $4, $5);';
        const values = [name, description, category_id, price, quantity];
        await client.query(query, values);
        res.redirect('/items');
        client.release();
    } catch(err) {
        console.error('Error adding new item:', err);
        res.status(500).send('Error adding new item');
    }
};

exports.itemDetail = async (req, res) => {
    const itemId = req.params.id;

    try{
        const client = await pool.connect();
        const query = 'SELECT i.id, i.name, i.description, c.name AS category, i.price, i.quantity FROM items i INNER JOIN categories c ON i.category_id = c.id WHERE i.id = $1;'; 
        const result = await client.query(query, [itemId]);
        const item = result.rows[0];
        client.release();

        if(item) {
            res.render('item-detail', { title: item.name, item: item });
        } else {
            res.status(404).send('Item not Found');
        }
    } catch(err) {
        console.error('Error fetching item details:', err);
        res.status(500).send('Error fetching item details');
    }
};

exports.itemEditGet = async (req, res) => {
    const itemId = req.params.id;

    try{
        const client = await pool.connect();
        const query = 'SELECT i.id, i.name, i.description, i.category_id, c.name AS category_name, i.price, i.quantity FROM items i INNER JOIN categories c ON i.category_id = c.id WHERE i.id = $1;';
        const result = await client.query(query, [itemId]);
        const item = result.rows[0];
        const categoriesResult = await client.query('SELECT id, name FROM categories ORDER BY name ASC;');
        const categories = categoriesResult.rows;
        client.release();

        if(item) {
            res.render('edit-item', { title: `Edit: ${item.name}`, item: item, categories: categories});
        } else {
            res.status(404).send('Item not found');
        }
    } catch(err) {
        console.error('Error fetching item for edit:', err);
        res.status(500).send('Error fetching item for edit');
    }
};

exports.itemEditPost = async (req, res) => {
    const itemId = req.params.id;
    const { name, description, category_id, price, quantity } = req.body;

    try {
        const client = await pool.connect();
        const query = 'UPDATE items SET name = $1, description = $2, category_id = $3, price = $4, quantity = $5 WHERE id = $6;';
        const values = [name, description, category_id, price, quantity, itemId];
        await client.query(query, values);
        client.release();
        res.redirect(`/items/${itemId}`);
    } catch(err) {
        console.error('Error updating item:', err);
        res.status(500).send('Error updating item');
    }
};

exports.itemDeletePost = async (req, res) => {
    const itemId = req.params.id;

    try {
        const client = await pool.connect();
        const query = 'DELETE FROM items WHERE id = $1;';
        await client.query(query, [itemId]);
        client.release();
        res.redirect('/items?deleted=true');
    } catch(err) {
        console.error('Error deleting item:', err);
        res.status(500).send('Error deleting item');
    }
};