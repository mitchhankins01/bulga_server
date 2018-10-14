"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class Index {
    routes(app) {
        app.get('/', (req, res) => {
            res.status(200).send({ message: 'Sucess' });
        });
        app.post('/tx', (req, res) => {
            const transaction = req.body.parse.output;
            const date = transaction.date
                .split(' ')
                .map(str => str.replace(/,/g, ''))
                .map(str => {
                if (str.match(/^[A-Za-z]+$/)) {
                    return moment()
                        .month(str)
                        .format('M');
                }
                else {
                    return str;
                }
            });
            console.log(date);
            res.send(date);
        });
    }
}
exports.default = Index;
//# sourceMappingURL=index.js.map