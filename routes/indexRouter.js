const { Router } = require("express");
const invController = require("../controllers/invController");
const invRouter = Router();

invRouter.get("/", invController.invListGet);
invRouter.get("/manage", invController.invManageGet);
invRouter.post("/manage/newTitle", invController.invNewGamePost);
invRouter.post("/manage/newGenre", invController.invNewGenrePost);
invRouter.post("/manage/newDeveloper", invController.invNewDevPost);
invRouter.get("/update/games/:id", invController.invUpdateItemGet);
invRouter.get("/update/genres/:id", invController.invUpdateItemGet);
invRouter.get("/update/developers/:id", invController.invUpdateItemGet);
invRouter.post("/update/games/:id", invController.invUpdateGamePost);
invRouter.post("/update/genres/:id", invController.invUpdateGenrePost);
invRouter.post("/update/developers/:id", invController.invUpdateDevPost);
invRouter.post("/delete/games/:id", invController.invDeleteGamePost);

module.exports = invRouter;