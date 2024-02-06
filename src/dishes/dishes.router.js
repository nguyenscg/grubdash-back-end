const router = require("express").Router(); // create new instance of Express router
const controller = require("./dishes.controller"); // import dishes controller
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:dishId").get(controller.read).put(controller.update).all(methodNotAllowed); // use route handler for get /:dishId

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed); // use route handler for get requests, post /dishes

module.exports = router;
