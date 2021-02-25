const Person = require("../models/person");
const City = require("../models/city");
const db = require("../util/database");

exports.new = (req, res, next) => {
    //res.send("<h2>FIRST ONE</h2>");
    //res.sendFile(path.join(__dirname, "../", "views", "add.html"));
    res.render("add", {csrf: res.locals.csrfToken});
    //res.redirect("/");
};

exports.add = (req, res, next) => {
    let name = req.body.name;
    let age = req.body.age;

    return req.city.createPerson({
        name: name,
        age: age
    }).then(result => {
        console.log(result);
        res.redirect("/user/all");
    }).catch(err => {
        console.log(err);
        res.render("add", {csrf: req.csrfToken()});
    });

    /*return City.findByPk(1).then(city => {
        return Person.create({
            name: name,
            age: age,
            cityId: req.city.id
        }).then(result => {
            console.log(result);
            res.redirect("/user/all");
        }).catch(err => {
            console.log(err);
            res.render("add");
        })
    });*/


    //res.send("<h2>FIRST ONE</h2>");
    //res.sendFile(path.join(__dirname, "../", "views", "add.html"));
    //res.redirect("/");
};

exports.all = async (req, res, next) => {
    /*var data = req.body;
    const person = new Person(data.name, data.age);*/
    /*Person.findAll({order: [['id', 'desc'], ['createdAt', 'desc']]})
        .then(persons =>{
        console.log(persons);
        res.render("all", {members: persons});
    }).catch(err =>{
        console.log(err);
        res.render("all", {members: []});
    });*/

    var test = await Person.findAll({order: [['id', 'desc'], ['createdAt', 'desc']]});

    var hello = new Hello();

    await hello.world();

    if(hello.hash !== null){
        return res.render("all", {members: test});
    }
    return res.render("all", {members: []});


/*
    const promise = new Promise((resolve, reject) => {
        db.query("SELECT 'a' as name, 25 as age", (err, res) => {
            members = res.rows;
            db.end();
            resolve("ok");
        });
    });
    promise.then((value) => {
        console.log("=========================");
        console.log(members);
    });

    promise;*/
    //res.render("show", {members: members});

    /*
        const save = async () => {
            const addMember = {
                then: (resolve, reject) => {
                    db.query("SELECT 'a' as name, 25 as age", (err, res) => {
                        members = res.rows;
                        console.log(members);
                        db.end();
                    });
                    resolve('ok');
                }
            };
            await addMember;
        };
        save();
    console.log("====================");
    console.log(members);*/


    /*console.log(person.save());
    /*const members = [];
    var member = [];
    member["name"] = data.name;
    member["age"] = data.age;
    members.push(member);*/

    /*Person.delete(2);
    members = Person.fetchAll();
console.log(members);
    //res.setHeader("Content-Type", "text/html");
    //res.send("MY NAME IS : "+name);

    res.render("show", {members: members});
*/
    //next(); //next middleware (next .use matches url)
};

var Hello = function () {
    this.hash = null;
};

Hello.prototype.world = async function () {
    await sleep(5000);
    this.hash = "NICE CHANGES :)";
};

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

exports.show = (req, res, next) => {
    var idPerson = req.params.id;

    Person.findByPk(idPerson).then(person => {
        console.log(person);
        res.render("show", {member: person});
    }).catch(err => {
        console.log(err);
        res.render("show", {member: []});
    });
};

exports.update = (req, res, next) => {
    var idPerson = req.params.id;
    var name = req.body.name;
    var age = req.body.age;

    Person.findByPk(idPerson).then(person => {
        person.name = name;
        person.age = age;
        return person.save();
    }).then(result => {
        res.redirect("/user/show/" + idPerson);
    }).catch(err => {
        console.log(err);
        res.render("edit", {member: person, csrf: res.locals.csrfToken });
    });
};

exports.edit = (req, res, next) => {
    var idPerson = req.params.id;

    Person.findByPk(idPerson).then(person => {
        res.render("edit", {member: person, csrf: res.locals.csrfToken});
    }).catch(err => {
        console.log(err);
        res.render("all");
    });
};

exports.delete = (req, res, next) => {
    var idPerson = req.params.id;

    Person.findByPk(idPerson).then(person => {
        return person.destroy();
    }).then(result=>{
        res.end("PROFILE ID : "+idPerson+" HAS BEEN DELETED SUCCESSFULY");
    }).catch(err => {
        res.end("ERROR : ", err);
    });
};


/******************* API REST ********************/
exports.apiall = (req, res, next) => {
    try{
        Person.findAll({order: [['id', 'desc'], ['createdAt', 'desc']]})
            .then(persons => {
                res.status(200).json({
                    users: persons.map((value, index)=>{
                        return {"id": persons[index]['id'], "name": persons[index]['name'], "create_at": persons[index]['createdAt']};
                    })
                });
            }).catch(err => {
            console.log(err);
            return res.status(500).json({message: "Erreur inconnu!"});
        });
    }catch (err) {
        return res.status(500).json({message: err.message });
    }
};


exports.apiadd = (req, res, next) => {
    let name = req.body.name;
    let age = req.body.age;

    return req.city.createPerson({
        name: name,
        age: age
    }).then(result => {
        res.status(201).json({"message": "User added successfully!"});
    }).catch(err => {
        return res.status(500).json({message: "Erreur inconnu!"});
    });
};