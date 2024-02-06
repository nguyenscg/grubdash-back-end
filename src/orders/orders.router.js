const router = require("express").Router();
const controller = require("./orders.controller");

router.route("/:orderId").get(controller.read);

router.route("/").get(controller.list);

module.exports = router;
