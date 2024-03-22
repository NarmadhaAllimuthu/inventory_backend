
const express = require('express');
const router = express.Router();  
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const {Product} = require('../models/inventoryProductModels');
const auth = require('../authorization');


try {
    mongoose.connect(process.env.MONGO_URL);

    // console.log("Database connected");

} catch (error) {
    console.error("Error connecting to the database:", error);
}


router.get("/",(req,res)=>{
    res.send("Inventory Product")
})


router.get("/getAllProducts",auth, async (req, res) => {
    try {
        const products = await Product.find();
        console.log(products);
        if(products.length == 0){
            res.status(404).json({ error: "No products found" })
        } else{
            console.log(products);
            res.setHeader("Cache-Control", "no-store");
            res.status(200).json(products);
    }
     
    } catch (error) {
        console.log("error",error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);

router.post("/createProduct",auth, async (req, res) => {

    try {
        const existingProduct = await Product.findOne({ productName: req.body.productName });

        if (existingProduct) {
            return res.status(400).json({ error: "Already existing Product" });
        }
        const { productName,productMaterial,productBasePrice,quantity, productSellingPrice, productGst } = req.body;

        const productId = "A1P" + (await Product.countDocuments() + 1);
        // const productSellingPrice =parseInt( productBasePrice )+ 2;

        const newProduct = new Product({
            productId,
            productName,
            productMaterial,
           productBasePrice,
           productSellingPrice,
            quantity,
            productGst
        });
        const savedProduct = await newProduct.save();
        res.status(201).send("New Product Added Successfully ");
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get("/editProduct/:id",auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        // console.log(product)
        if (product == null) {
            res.status(404).json({ error: "Product not found" })
        } else {
            res.status(200).json(product);
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.put("/editProduct/:id",auth, async (req, res) => {
    try {
        

        // Check if the new email already exists in the database
        const existingProduct = await Product.findOne({ _id: new ObjectId(req.params.id) });
        // console.log(existingProduct)
        if (existingProduct) {
            // console.log(req.body)
            const updateProduct = await Product.findOneAndUpdate({ _id: existingProduct._id }, { $set: req.body }, { new: true });
            // console.log(updateProduct)
            return res.status(200).send("Updated Successfully !");

        }


        else if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/viewProduct/:id",auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product == null) {
            res.status(404).json({ error: "Product not found" })
        } else {
            res.status(200).json(product);
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get("/getProduct/:productName", auth,async (req, res) => {
    try {
        const product = await Product.findOne({productName:req.params.productName});
        if (product == null) {
            res.status(404).json({ error: "Product not found" })
        } else {
            res.setHeader("Cache-Control", "no-store");
            res.status(200).json(product);
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
})
router.delete("/deleteProduct/:id",auth ,async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product == null) {
            res.status(404).json({ error: "product not found" })
        } else {
            res.status(200).send("product Data Successfully Deleted !");
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/getLessStockAlert",auth,async(req,res)=>{
    try {
        const products = await Product.find({$expr: {
            $lte: [
              { $toInt: "$quantity" }, 
              2
            ]
          }});
        
        console.log(products);
        if(products.length == 0){
            res.status(404).json({ message: "No products with quantity less than 2 found" });
        } else{
            console.log(products);
            res.setHeader("Cache-Control", "no-store");
            res.status(200).json(products);
    }
     
    } catch (error) {
        console.log("error",error)
        res.status(500).json({ error: "Internal Server Error" });
    }

})




module.exports = router;



