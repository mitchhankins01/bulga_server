"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.TXSchema = new Schema({
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
    },
    category: {
        type: String,
        default: 'Others'
    }
});
//# sourceMappingURL=txModel.js.map