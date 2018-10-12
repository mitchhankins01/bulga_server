"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Index {
    routes(app) {
        app.get('/', (req, res) => {
            res.status(200).send({ message: 'Sucess' });
        });
    }
}
exports.default = Index;
//# sourceMappingURL=index.js.map