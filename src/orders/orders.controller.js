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
    
    if (foundOrder) {
      res.locals.user = foundOrder;
      next();
    }
    next({
        status: 404,
        message: `Order id not found: ${orderId}`,
    });
}

function bodyDataHas(propertyName) {
    return function(req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
            return next();
        }
        next({ status: 400, message: `Must include a ${propertyName}` });
    };
}

function hasValidId(req, res, next) {
    const { orderId } = req.params;
    const { data: { id } = {} } = req.body; // if id exists, check for matching id
    if (id && id !== orderId) {
      next({
        status: 400,
        message: `Doesn't match id ${id}`
      });
    }
   next();
}

function isDishesValid(req, res, next){
    const { data: { dishes } = {} } = req.body;
    
    if (!dishes) {
        return next({
            status: 400,
            message: "Order must include a dish"
        })
    }
    next();
}

function hasValidQuantity(req, res, next) {
    const { data: { quantity } = {} } = req.body;
    
    if (!quantity) {
        return next({
            status: 400,
            message: `Dish ${quantity} must have a quantity that is an integer greater than 0`
        })
    }
    next();
}

function hasValidStatus(req, res, next){
    const { data: { status } = {} } = req.body;
    if (!status) {
        return next({
            status: 400,
            message: "Order must include a dish"
        })
    }
    next();
}

function read(req, res, next) {
  const foundOrder = res.locals.order;
  if(foundOrder) {
    // create new order
    const orderRecord = {
      id: nextId(),
      deliverTo,
      mobileNumber,
      status,
      dishes
    }
  }
  orders.push(orderRecord);
  return res.json({ data: foundOrder });
}

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function update(req, res, next) {
    const orderId = req.params.orderId;
    const ogOrder = res.locals.order;

    const { data: { id, deliverTo, mobileNumber, status, dishes } } = req.body;
    if (id && id !== orderId) {
        return next({ 
          status: 404, 
          mesage: "Order id does not match route id"})
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
            message: "An order cannot be deleted unless it is pending" 
        });
    }
}

module.exports = {
    list,
    read: [orderExists, read],
    create: [
      hasValidId, 
      create
    ],
    update: [
      hasValidId, 
      orderExists, 
      update
    ],
    delete: [
      orderExists, 
      destroy
    ],
}