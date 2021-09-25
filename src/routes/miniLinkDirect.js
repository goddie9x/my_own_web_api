const express = require('express');
const route = express.Router();
const MiniLinkDirect = require('../app/controllers/MiniLinkDirect');

route.get('/:link', MiniLinkDirect.link);
route.post('/', MiniLinkDirect.create);
route.get('/', MiniLinkDirect.index);

module.exports = route;