const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// router-handler for orders
function list(req, res) {
    res.json({ data: orders });
}

function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === Number(orderId));
    
    if(foundOrder) {
        res.locals.user = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `Order id not found: ${orderId}`,
    });
}

function read(req, res, next) {
    res.json({ data: res.locals.order });
};

module.exports = {
    list,
    read: [orderExists, read],
}