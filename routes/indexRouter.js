const { Router } = require("express");
const invController = require("../controllers/invController");
const invRouter = Router();

invRouter.get("/", invController.invListGet);
invRouter.get("/manage", invController.invManageGet);
invRouter.post("/manage/:table", invController.invNewItemPost);
invRouter.get("/update/:table/:id", invController.invUpdateItemGet);
invRouter.post("/update/:table/:id", invController.invUpdateItemPost);
invRouter.post("/delete/:table/:id", invController.invDeleteItemPost);

module.exports = invRouter;