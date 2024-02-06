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

module.exports = {
    list,
};