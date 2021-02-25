const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const moragn = require("morgan");
const winston = require("winston");
const bodyParser = require("body-parser");
const routerU = require("./routes/users");
const routerM = require("./routes/member");
const fs = require("fs");
const path = require("path");
const sequelize = require("./util/database");
const Person = require("./models/person");
const City = require('./models/city');
const session = require('express-session');
const isAuth = require('./middleware/is-auth');
const csrf = require("csurf");
const flash = require("connect-flash");
const apiAuth = require("./middleware/api-auth");
const csrfProtection = csrf();
require('dotenv').config();

const graphqlHttp = require("express-graphql");
const graphqlResolver = require("./graphql/resolvers");
const graphqlSchema = require("./graphql/schema");


const app = express();

const globaLog = fs.createWriteStream(path.join(__dirname, "globaLog.log"), {flags: "a"});

app.set('view engine', 'ejs'); //default engine will be user : ejs | pug
app.set('views', 'views'); // folder views

app.use(bodyParser.urlencoded({extended: false})); //req.body => Object will contain key-value pairs,
                                                  // when extended is false => the value can be a string or array.
                                                  // when extended is true => the value can be any type.
app.use("/api/",bodyParser.json());
app.use("/graphql",bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
    City.findByPk(1).then(city => {
        req.city = city;
        next();
    }).catch(err => console.log(err));
});
app.use(session({secret: 'hello world', resave: false, saveUninitialized: false}));

app.use(flash());

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({filename: './logs/error.log', level: 'error'}),
        new winston.transports.File({filename: './logs/global.log', level: 'combined'})
    ]
});
logger.log("error", "TEST LOG WINSTON!");
logger.log("error", process.env.param1);


app.use(helmet()); // secure header response (example: Strict-Transport-Security: max-age=15552000; includeSubDomains, X-Content-Type-Options: nosniff, X-DNS-Prefetch-Control: off, X-Download-Options: noopen, X-Frame-Options: SAMEORIGIN, X-XSS-Protection: 1; mode=block )
app.use(compression());
app.use(moragn("combined", globaLog));
app.use("/graphql", /*(req, res, next) => {
    console.log(req.body)
}, */graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver
}));

app.use("/app", apiAuth, routerU);
app.use("/api", routerM);


app.use(csrfProtection);

app.use((req, res, next) =>{
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/member", routerM);

app.use("/user", isAuth, csrfProtection, routerU);

app.use("/c",(req, res, next) => {
    res.send("DEFAULT ROUTE");
    //next(); //next middleware (next .use matches url)
});


app.use((req, res, next) =>{
    res.status(404).send("<h1>PAGE NOT FOUND</h1>");
});


Person.belongsTo(City, {constraints: true});/*, onDelete: "CASCADE"*/
City.hasMany(Person);


sequelize.sync(/*{force: true}*/).then(result => {
    console.log(result);
    app.listen(3000);
    /*const server = app.listen(3000);
    const io = require("socket.io")(server);
    io.on("connection", socket =>{
        console.log("Client connected :)");
    });*/
}).catch(err => {
    console.log(err);
});

/*
const member = require("./models/member");
const bcrypt = require("bcryptjs");
bcrypt.hash("salim", 12).then(hashedPass =>{
    member.create({login: "salim", password: hashedPass});
});*/
/*
======> var vs let : deference in scope : word "var" end when function ended , "let" end when enclosing }

example 'var' work : function a(){
    if(1 == 1){
        var c = 1;
    }
        console.log(c);
}
        console.log(c); // not working


example 'let' work : function a(){
    if(1 == 1){
        let c = 1;
        console.log(c);
    }
        console.log(c); // not working
}


const promise = new Promise(function (resolve, reject) {
    resolve(1);
});

promise.then(first).then(second).then(function (response, err) {
    console.log(response);
});

function first(value){
    return value + 2;
}
function second(value){
    return value + 2;
}



const data = ["T1", "T2"];

console.log(data.map(d => "IS : " + d));

const copiedData = [...data]; // ...means copied without referenced to original
data.push("T4");
copiedData.push("T3");
console.log(copiedData);
console.log(data);



const add = (a, b) => a+b;
const add1 = a => a + 1;
const add2 = () => 15 + 5;
const add3 = (a, b) => {
    return a + b;
};
console.log(add(1+2));
console.log(add1(1+2));
console.log(add2());

const fs = require("fs");

fs.writeFileSync(__dirname+"/text.txt", "HELLO WORLD!")

const dns = require("dns");

dns.lookup("www.google.com", (err, addresses, family) => {
    console.log("addresses : ", addresses);
    console.log("family : ", family);
});
dns.resolve4("www.google.com", (err, addresses) => {
    console.log("addresses : ", addresses);
});
dns.reverse("216.58.201.164", (err, addresses) => {
    console.log("ihostname : ", addresses);
});
dns.lookupService("216.58.201.164", 80, (err, hostname, service) => {
    console.log(hostname, service);
});

const fs = require("fs");

function myCallback(err, data){
    if(err){
        console.log("IS ERROR : ", err);
        return;
    }
    console.log("IS OK : ", data);
}

fs.readFile(__dirname+"/file.txt", myCallback);

var http = require("http");

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end("hello world!");
}).listen(8080);


console.log(__dirname);
console.log(__filename);


const os = require("os");

console.log(os.freemem());
console.log(os.homedir());
console.log(os.hostname());
console.log(os.endianness());
console.log(os.loadavg());
console.log(os.platform());
console.log(os.release());
console.log(os.tmpdir());
console.log(os.totalmem());
console.log(os.type());
console.log(os.uptime());
console.log(os.userInfo());
console.log(os.cpus());
console.log(os.arch());*/
