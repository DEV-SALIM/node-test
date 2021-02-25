const sequelize = require("../util/database");
const Member = require("../models/member");
const bcrypt = require("bcryptjs");
//const { validationResult } = require("express-validator/check");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) =>{
    res.render("login", {errors: req.flash("error")});
};

exports.connect = (req, res, next) => {
    let login = req.body.login;
    let password = req.body.password;
    let errors = "";
    let errValidation = validationResult(req);
    if(!errValidation.isEmpty()){
        let errorsVal = errValidation.array();
        for(let i=0;i<errorsVal.length; i++){
            req.flash("error", errorsVal[i].msg+"\n");
        }
        return res.redirect("/member/login");
    }
    return Member.findOne({where: {login: login}})
        .then((member) => {
            if (!member) {
                throw member;
            } else {
                bcrypt.compare(password, member.password).then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.member = member;
                        return req.session.save(err =>{
                            return res.redirect("/user/all");
                        });
                    }
                    req.flash("error", "PASSWORD IS INCORRECT!");
                    res.redirect("/member/login");
                    //res.redirect("/member/login", {errors: "PASSWORD IS INCORRECT!"});
                }).catch();
            }
        })
        .catch(err => {
            console.log(err);
            req.flash("error", "LOGIN IS INCORRECT!");
            res.redirect("/member/login");
            //res.render("login", {errors: "LOGIN IS INCORRECT!"});
        });
};

exports.token = async (req, res, next) => {
    let login = req.body.login;
    let password = req.body.password;
    let errors = "";
    var resToken = {"token": null, "login": null};
    let errValidation = validationResult(req);
    if (!errValidation.isEmpty()) {
        let errorsVal = errValidation.array();
        for (let i = 0; i < errorsVal.length; i++) {
            return res.json({"message": errorsVal[i].msg});
        }
    }

    var member = await Member.findOne({where: {login: login}}).then((member) => {
        if (!member) {
            throw member;
        } else {
            return member;
        }
    }).catch(err => {
        return res.json({"message": "LOGIN IS INCORRECT!"});
    });
    resToken = await
        bcrypt.compare(password, member.password).then(doMatch => {
            if (!doMatch) {
                return res.json({"message": "PASSWORD IS INCORRECT!"});
            }
            let token = jwt.sign({
                    id: member.id,
                    login: member.login
                },
                "thisismyprivatesecret",
                {expiresIn: "1h"});
            return {"token": token, "login": member.login};
        }).catch();


    return res.status(200).json(resToken);

    /*return Member.findOne({where: {login: login}})
        .then((member) => {
            if (!member) {
                throw member;
            } else {
                bcrypt.compare(password, member.password).then(doMatch => {
                    if (!doMatch) {
                        return res.json({"message": "PASSWORD IS INCORRECT!"});
                    }
                    let token = jwt.sign({
                            id: member.id,
                            login: member.login
                        },
                        "thisismyprivatesecret",
                        {expiresIn: "1h"});
                    return res.status(200).json({"token": token, "login": member.login});
                }).catch();
            }
        })
        .catch(err => {
            return res.json({"message": "LOGIN IS INCORRECT!"});
        });*/
};

exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/member/login");
};