"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.TXSchema = new Schema({
    author: {
        type: String,
        required: 'Author missing'
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
    },
    fullDate: {
        type: String,
        required: 'Date missing'
    },
    year: {
        type: String,
        required: 'Year missing'
    },
    month: {
        type: String,
        required: 'Month missing'
    },
    day: {
        type: String,
        required: 'Day missing'
    },
    bankQueId: String
});
//# sourceMappingURL=txModel.js.map