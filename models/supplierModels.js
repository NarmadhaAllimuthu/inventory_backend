
const mongoose = require("mongoose");


const supplierSchema = mongoose.Schema({
    supplierId: {   
        type: String,
        required: [true, "Please add a supplier Id"],
        unique: true
    },
    supplierName: {
        type: String,
        required: [true, "Please add a name"]
    },
    supplierEmail: {
        type: String,
        required: [true,"Please add email Id"],
        unique: true,
        trim: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"]
    }
    ,
    supplierPhone: {
        type: String,
        required: [true, "Please add a phone number"]
    }
    ,
    supplierAddress: {
        type: String,
        required: [true, "Please add a address"]
    }
    ,
    gst: {
        type: String,
        required: [true, "Please add a GST number"]
    },
    contactPerson: {
        type: String,
        required: [true, "Please add a contact person"]
    },supplierInfo:{
        type:String,
        default:"no info"

    }
})


const Supplier= mongoose.model('supplier', supplierSchema);

module.exports = {Supplier};



