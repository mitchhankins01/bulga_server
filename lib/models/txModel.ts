import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const TXSchema = new Schema({
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
