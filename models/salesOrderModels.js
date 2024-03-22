

const mongoose = require("mongoose");


const salesOrderSchema = new mongoose.Schema({
    salesOrderId: {
        type: String,
        required: true,
        unique :true
    },
    userShopDetails:{
        type: Array,
        required: true

    }
    ,
    customerDetails:{
        type: Array,
        required: true
    },
    productName: {
        type: String,
        required: true,
        unique:false
    },
   
    productQuantity: {
        type: String,
        required: true,
        unique:false
    },
    productBasePrice: {
        type: String,
        required: true,
        unique:false
    },
    productSellingPrice:{
        type: String,
        required: true,
        unique:false
    },
    productTax:{
        type: String,
        required: true,
        unique:false
    },
    totalAmount :{
        type: String,
        required: true,
        unique:false
    },
    salesOrderDate :{
        type: String,
        required: true
    },  status: {
        type: Boolean,
        default: true,
      },created_at: { 
        type: Date, 
        default: Date.now 
    }
})



const SalesOrder  = mongoose.model("salesOrder", salesOrderSchema);

module.exports = { SalesOrder };

















