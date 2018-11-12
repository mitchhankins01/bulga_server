"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const txRoute_1 = require("./routes/txRoute");
const userRoute_1 = require("./routes/userRoute");
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}
require('./models/UserModel');
require('./config/passport');
class App {
    constructor() {
        this.txRoute = new txRoute_1.default();
        this.userRoute = new userRoute_1.default();
        this.mongoUri = process.env.MONGO_URI;
        this.app = express();
        this.config();
        this.mongoInit();
        this.txRoute.routes(this.app);
        this.userRoute.routes(this.app);
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            }
            else {
                next();
            }
        });
        this.app.use(session({
            cookie: { maxAge: 6000 },
            resave: false,
            saveUninitialized: false,
            secret: process.env.PASSPORT_SECRET
        }));
    }
    mongoInit() {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUri, { useNewUrlParser: true });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map