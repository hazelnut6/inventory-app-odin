


exports.home = (req, res) => {
    res.send('This is home');
};

exports.itemList = (req, res) => {
    res.send('List of items will be shown here');
};

exports.itemListByCategory = (req, res) => { 
    res.send('Items will be shown by category');
};

exports.itemSearch = (req, res) => {
    res.send('Searched items will be shown here');
};

exports.itemCreateGet = (req, res) => {
    res.send('Add item: will be directed to form');
};

exports.itemCreatePost = (req, res) => {
    res.send('Add item: form inputs will posted/submitted');
};

exports.itemDetail = (req, res) => {
    res.send('Details of clicked item');
};

exports.itemEditGet = (req, res) => {
    res.send('Edit item: will be directed to form with item info');
};

exports.itemEditPost = (req, res) => {
    res.send('Edit item: updated info will be posted/submitted');
};

exports.itemDeletePost = (req, res) => {
    res.send('Chosen item will be deleted');
};