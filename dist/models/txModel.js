"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.TXSchma = new Schema({
    date: {
        type: String,
        required: 'Date missing'
    },
    amount: {
        type: Number,
        required: 'Amount missing'
    },
    merchant: {
        type: String,
        required: 'Merchant missing'
    }
});
//# sourceMappingURL=txModel.js.map