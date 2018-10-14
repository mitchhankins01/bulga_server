"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const txRoute_1 = require("./routes/txRoute");
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}
class App {
    constructor() {
        this.txRoute = new txRoute_1.default();
        this.mongoUri = process.env.MONGO_URI;
        this.app = express();
        this.config();
        this.mongoInit();
        this.txRoute.routes(this.app);
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    mongoInit() {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUri, { useNewUrlParser: true });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map