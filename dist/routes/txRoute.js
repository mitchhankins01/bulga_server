"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const txController_1 = require("../controllers/txController");
class TXRoute {
    constructor() {
        this.txController = new txController_1.TXController();
    }
    routes(app) {
        app.route('/tx').post(this.txController.addTransaction);
    }
}
exports.default = TXRoute;
//# sourceMappingURL=txRoute.js.map