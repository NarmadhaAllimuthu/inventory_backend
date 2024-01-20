const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerAddress: {
        type: String,
        required: true,
    },
    customerContact: {
        type: String,
        required: true,
        unique: true,
    },
});



const customer = mongoose.model('customer', customerSchema);

module.exports = {customer};











