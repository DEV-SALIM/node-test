const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member");
//const { check, body } = require("express-validator/check");
const { check, body } = require("express-validator");

router.get("/login", memberController.login);

router.post("/login", [
    check("login", 'Login field is required!').not().isEmpty({ ignore_whitespace: true }),
    body("password", 'Password should be isAlphanumeric and least 5 characteres.').isLength({min:5}).isAlphanumeric()
] , memberController.connect);

router.get("/logout", memberController.logout);


/******************* API REST ********************/
router.post("/rest/login", [
    check("login", 'Login field is required!').not().isEmpty({ ignore_whitespace: true }),
    body("password", 'Password should be isAlphanumeric and least 5 characteres.').isLength({min:5}).isAlphanumeric()
] , memberController.token);


module.exports = router;