
const mongoose = require("mongoose");

const purchaseOrder = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    orderBy: {
        type: Array,
        required: true
    }, orderTo: {
        type: Array,
        required: true
    }, orderDate: {
        type: Date,
        required: true
    },
    orderItem: {
        type: Array,
        required: true
    }
});




const storeReceipt = new mongoose.Schema({
    receiptId: {
        type: String,
        required: true,
        unique: true
    }, invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    invoiceDate: {
        type: Date,
        required: true
    }, supplierName: {
        type: String,
        required: true
    },
    supplierContact: {
        type: String,
        required: true
    },
    supplierId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    basePrice: {
        type: String,
        required: true
    },
    tax: {
        type: String,
        required: true
    },
    purchaseOrderId: {
        type: String,
        required: true,
        unique: true
    },
    receivingPersonName: {
        type: String,
        required: true
    },
    totalAmount: {
        type: String,
        required: true
    }
})


const PurchaseOrder = mongoose.model('purchaseOrder', purchaseOrder);

const StoreReceipt = mongoose.model('storeReceipt', storeReceipt);

module.exports = { PurchaseOrder,StoreReceipt };














