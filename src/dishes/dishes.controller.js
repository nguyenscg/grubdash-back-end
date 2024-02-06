const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
// dishes route
// handlers and middleware functions to create, read, update, and list dishes. dishes cannot be deleted

// router-handler function --- this will GET /dishes endpoint
function list(req, res) {
    res.json({ data: dishes });
}

let lastDishId = dishes.reduce((maxId, dish) => Math.max(maxId, dish.id), 0);

// create-dish validation
function bodyDataHas(propertyName) {
    return function(req, res, next) {
        const { data: {} } = req.body;
        if (data[propertyName]) {
            return next();
        }
        next({ status: 400, message: `Must include a ${propertyName}` };)
    };
}

// name validation
// name || name property is missing, name property is empty "" -> Error message: Dish must include a name
function namePropertyIsValid(req, res, next) {
    const { data: { name } = {} } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Dish must include a name'});
    }
    next();
}

// description validation
// description || description property is missing, description property is empty "" -> Error message: Dish must include a description
function descriptionPropertyIsValid(req, res, next) {
    const { data: { description } = {} } = req.body;

    if (!description) {
        return res.status(400).json({ error: 'Dish must include a description'});
    }
}

// price validation
// price property is missing, price property 0 or less, price property is not an integer -> Error message: Dish must include a price,
function pricePropertyIsValid(req, res, next) {
    const { data: { price } = {} } = req.body;

    if (price <= 0 || !Number.isInteger(price)) {
        return next({
            status: 400,
            message: `Dish must have a price that is an integer greater than 0`
        });
    }
    next();
}

// image_url validation
// image_url property is missing, image_url property is empty "" -> Error message: Dish must include a image_url, Dish must include a image_url
function imageUrlPropertyisValid(req, res, next) {
    const { data: { image_url} = {} } = req.body;

    if (!image_url) {
        return next({
            status: 400,
            message: "Dish must include a image_url"
        });
    }
    next();
}

function create(req, res) {
    const { data: { name , description, price, image_url } = {} } = req.body;
    const newDish = {
        id: ++lastDishId,
        name,
        description,
        price,
        image_url,
    }
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

// read-dish handler ---- GET /dishes/:dishId
function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === Number(dishId));

    if (foundDish) {
        return next();
    }
    next({
        status: 404,
        message: `Dish id not found: ${dishId}`,
    });
}

// read
function read(req, res) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dishes) => dish.id === Number(dishId));
    res.json({ data: foundDish });
}

// update dish handler
function update(req, res) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === Number(dishId));
    const { data: { name, description, price, image_url } = {} } = req.body;

    // update dish
    foundDish.name = name;
    foundDish.description = description;
    foundDish.price = price;
    foundDish.image_url = image_url;

    res.json({ data: foundDish });
}

module.exports = {
    create: [
        bodyDataHas("name"), 
        bodyDataHas("description"), 
        bodyDataHas("price"), 
        bodyDataHas("image_url"),
        namePropertyIsValid,
        descriptionPropertyIsValid,
        pricePropertyIsValid, 
        imageUrlPropertyisValid,
        create
    ],
    list,
    read: [dishExists, read],
    update: [
        dishExists, 
        bodyDataHas("name"), 
        bodyDataHas("description"), 
        bodyDataHas("price"), 
        bodyDataHas("image_url"), 
        update
    ],
};