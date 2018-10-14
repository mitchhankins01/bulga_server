"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const txRoute_1 = require("./routes/txRoute");
class App {
    constructor() {
        this.txRoute = new txRoute_1.default();
        this.app = express();
        this.config();
        this.txRoute.routes(this.app);
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map