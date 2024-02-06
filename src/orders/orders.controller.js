const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// router-handler for orders
function list(req, res) {
    res.json({ data: orders });
}

module.exports = {
    list,
}