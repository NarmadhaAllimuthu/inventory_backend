
var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Supplier } = require('../models/supplierModels');
const auth = require('../authorization');
const dotenv = require("dotenv").config();


try {
    mongoose.connect(process.env.MONGO_URL);

    console.log("Database connected");

} catch (error) {
    console.error("Error connecting to the database:", error);
}


router.post("/create-supplier",auth, async (req, res) => {

    try {
        const existingSupplier = await Supplier.findOne({ supplierEmail: req.body.supplierEmail });

        if (existingSupplier) {
            return res.status(400).json({ error: "Supplier with this email already exists." });
        }
        const { supplierName, supplierEmail, supplierPhone, supplierAddress, gst, contactPerson, supplierInfo } = req.body;
       
        const supplierId = "S" + (await Supplier.countDocuments() + 1)+"U"+ (await Supplier.countDocuments() );
       
        const newSupplier = new Supplier({
            supplierId,
            supplierName,
            supplierEmail,
            supplierPhone,
            supplierAddress,
            gst, contactPerson,
            supplierInfo
        });
        const savedSupplier = await newSupplier.save();
        res.status(201).send("New Supplier Added Successfully ");
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})


router.get("/get-supplier/:supplierName",auth ,async (req, res) => {
    try {
        const suppliers = await Supplier.find({ supplierName: req.params.supplierName });
        if (suppliers == null) {
            res.status(404).json({ error: "Supplier not found" })
        } else {
            res.status(200).json(suppliers);
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
)


router.get("/view-supplier/:id",auth ,async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (supplier == null) {
            res.status(404).json({ error: "Supplier not found" })
        } else {
            res.status(200).json(supplier);
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get("/edit-supplier/:id", auth,async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (supplier == null) {
            res.status(404).json({ error: "Supplier not found" })
        } else {
            res.status(200).json(supplier);
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put("/edit-supplier/:id", auth,async (req, res) => {
    try {
        const { supplierEmail, ...updateData } = req.body;

        // Check if the new email already exists in the database
        const existingSupplier = await Supplier.findOne({ _id: new ObjectId(req.params.id) });
        // console.log(existingSupplier)
        if (existingSupplier) {
            // console.log(req.body)
            const updateSupplier = await Supplier.findOneAndUpdate({ _id: existingSupplier._id }, { $set: req.body }, { new: true });
            // console.log(updateSupplier)
            return res.status(200).send("Updated Successfully !");

        }


        else if (!existingSupplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.delete("/delete-supplier/:id", auth,async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (supplier == null) {
            res.status(404).json({ error: "Supplier not found" })
        } else {
            res.status(200).send("Supplier Data Successfully Deleted !");
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/getSupplierCount",auth,async(req,res)=>{
    try{
        const supplierCount = await Supplier.countDocuments();
        // console.log(supplierCount);
        res.status(200).json({supplierCount});
    }catch(err){
        res.status(500).json({message:err.message});
    }

})

router.get("/getAllSuppliersData",auth,async(req,res)=>{
    try{
        const suppliers = await Supplier.find({});
        res.status(200).json(suppliers);
    }catch(err){
        res.status(500).json({message:err.message});
    }
})


module.exports = router;




