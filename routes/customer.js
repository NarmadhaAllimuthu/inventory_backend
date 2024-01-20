const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const auth = require('../authorization');
const { customer } = require('../models/customerModels');



router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
})


router.post("/createCustomer" ,auth,async(req,res)=>{
    try{

        const existingCustomer = await customer.findOne({customerName:req.body.customerName});
        if(existingCustomer){
            res.status(400).json({message:"Customer already exists"});
        } else{
            const {customerName,customerAddress,customerContact} = req.body;

            const customerId = "C" + (await customer.countDocuments() + 1)+"ID";

            const newCustomer = new customer({
                customerId,
                customerName,
                customerAddress
                ,customerContact
            })
            const result = await newCustomer.save();
            res.status(200).json({message:"Customer created successfully"});

        }

    }catch(err){

        console.log(err);
        res.status(500).json({message:err.message});
    
    }
})


router.get("/getCustomerInfo/:id",auth,async(req,res)=>{
    try{
        const customerData = await customer.findOne({customerContact:req.params.id});
        if(!customerData){
            res.status(404).json({message:"Customer not found"});
        }else{
            res.status(200).json(customerData);
        }
    }catch(err){
        res.status(500).json({message:err.message});
    }

});



router.get("/getCustomerCount",auth,async(req,res)=>{
    try{
        const customerCount = await customer.countDocuments();
        // console.log(customerCount);
        res.status(200).json({customerCount});
    }catch(err){
        res.status(500).json({message:err.message});
    }

})



module.exports = router;

