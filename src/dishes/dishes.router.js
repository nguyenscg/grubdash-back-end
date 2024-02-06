const router = require("express").Router(); // create new instance of Express router
const controller = require("./dishes.controller"); // import dishes controller

router.route("/").get(controller.list); // use route handler for get requests

module.exports = router;
