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

function validateOrder(req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes } } = req.body;

    if(!deliverTo || deliverTo =="") {
        return next({ status: 400, message: "Order must include a deliverTo" })
    }
    if(!mobileNumber || mobileNumber == "") {
        return next({ status: 400, message: "Order must include a mobile number"})
    }
    if(!dishes) {
        return next({ status: 400, message: "Order must include a dish"})
    }
}

function read(req, res, next) {
    res.json({ data: res.locals.order });
};


function create(req, res, next) {
    orders.push(res.locals.newOrder);
    res.status(201).json({ data: res.locals.newOrder });
}

function update(req, res, next) {
    const orderId = req.params.orderId;
    const ogOrder = res.locals.order;

    const { data: { id, deliverTo, mobileNumber, status, dishes } } = req.body;
    if (id && id !== orderId) {
        return next({ status: 400, mesage: "Order id does not match route id"})
    }
}

function destroy(req, res, next) {
    const orderId = req.params.orderId;
    const foundOrder = orders.find((order) => order.id === Number(orderId));
    if (foundOrder > -1) {
        orders.splice(foundOrder, 1);
        res.sendStatus(204);
    }

    if (res.locals.order.status !== "pending") {
        return next({
            status: 400,
            message: `An order cannot be deleted unless it is pending` 
        });
    }
}

module.exports = {
    list,
    read: [orderExists, read],
    create: [validateOrder, create],
    update: [validateOrder, orderExists, update],
    delete: [orderExists, destroy],
}