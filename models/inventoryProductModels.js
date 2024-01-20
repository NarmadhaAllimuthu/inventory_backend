
const mongoose = require("mongoose");



const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true,
        unique: true
    },
    productMaterial: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    productBasePrice: {
        type: String,
        required: true
    },productSellingPrice:{
        type:String,
        required:true
    }
    ,
    productGst: {
        type: String,
        required: true
    }
});


const Product = mongoose.model('product', productSchema);

module.exports = { Product };

















