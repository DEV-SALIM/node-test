const express = require("express");
const path = require("path");
const personController = require("../controllers/person");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/add", personController.new);

router.post("/add", personController.add);

router.use("/all", personController.all);

router.use("/show/:id", personController.show);

router.post("/edit/:id", personController.update);

router.get("/edit/:id", personController.edit);

router.get("/delete/:id", personController.delete);

/******************* API REST ********************/
router.use("/rest/all", personController.apiall);

router.post("/rest/add", personController.apiadd);


module.exports = router;