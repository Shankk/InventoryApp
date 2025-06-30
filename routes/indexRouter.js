const { Router } = require("express");
const invController = require("../controllers/invController");
const invRouter = Router();

invRouter.get("/", invController.invListGet);
invRouter.get("/new", invController.invCreateItemGet);
invRouter.post("/new", invController.invCreateItemPost);
invRouter.get("/manage", invController.invManageItemGet);
invRouter.post("/update", invController.invUpdateItemPost);
invRouter.post("/delete", invController.invDeleteItemPost);

module.exports = invRouter;