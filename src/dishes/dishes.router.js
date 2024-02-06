const router = require("express").Router(); // create new instance of Express router
const controller = require("./dishes.controller"); // import dishes controller

router.route("/").get(controller.list).post(controller.create); // use route handler for get requests, post /dishes
router.route("/:dishId").get(controller.read).put(controller.update); // use route handler for get /:dishId

module.exports = router;
