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
    const foundOrder = orders.find((order) => order.id === (orderId));

    if (foundOrder) {
      res.locals.order = foundOrder;
      return next();
    } else {
        next({
            status: 404,
            message: `Order id not found: ${orderId}`,
        });
}}
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
    if (dishes.length !== 0 && Array.isArray(dishes)) {
      return next();
    } else {
      return next({
        status: 400,
        message: `Order must include at least one dish`,
      });
    }
}

function hasValidQuantity(req,res,next){
    const { data: { dishes } = {} } = req.body;
    dishes.forEach((dish, index) => {
        const quantity = dish.quantity;
        if (!quantity || quantity < 1 || Number(quantity) !== quantity) {
            next({
                status: 400,
                message: `Dish ${index} must have a quantity that is an integer greater than 0`,
            });
        }
    });
    next();
}

function hasValidStatus(req, res, next){
    const { data: { status } ={} } = req.body;
    if(!status || (status !== "pending" && status !== "preparing" && status !== "out-for-delivery") ){
        return next({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, delivered"

        });
    }
    else if(status === "delivered"){
        return next({
            status: 400,
            message: "A delivered order cannot be changed"
        });
    }
    next();
}

function hasValidDeliverTo(req, res, next) {
  const { data: { deliverTo } = {} } = req.body;
  
  if (!deliverTo) { // check if deliverTo is missing
    return next({
      status: 400,
      message: "Order must include a deliverTo"
    });
  }
}

function hasMobileNumber(req, res, next) {
  const { data: { mobileNumber } = {} } = req.body;
  
  if(!mobileNumber) {
    return next({
      status: 400,
      message: "Order must include a mobileNumber"
    });
  }
  next();
}


function read(req, res, next) {
  res.json({ data: res.locals.order });
}

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  
  if (!deliverTo) { // check if deliverTo is missing
    return next({
      status: 400,
      message: "Order must include a deliverTo"
    });
  }
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
    const order = res.locals.order;

    const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    if (id && id !== orderId) {
        return next({ 
          status: 400, 
          mesage: "Order id does not match route id"
        });
    }
  // update order
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  
  res.json({ data: order });
  
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
      bodyDataHas("deliverTo"),
      bodyDataHas("mobileNumber"),
      bodyDataHas("dishes"),
      isDishesValid,
      hasValidQuantity,
      create
    ],
    update: [ 
        orderExists,
        bodyDataHas("deliverTo"),
        bodyDataHas("dishes"),
        bodyDataHas("status"),
        hasValidId,
        isDishesValid,
        hasValidQuantity,
        hasValidStatus,
        hasMobileNumber,
        update
      ],
    delete: [
      orderExists, 
      destroy
    ],
}