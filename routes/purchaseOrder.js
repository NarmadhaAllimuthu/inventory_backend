
const express = require('express');

const router = express.Router();
// const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const auth = require('../authorization');
const { PurchaseOrder, StoreReceipt } = require('../models/purchaseOrderModels');
const { Product } = require('../models/inventoryProductModels');
const dotenv = require("dotenv").config();



router.post("/createPurchaseOrder", auth, async (req, res) => {
    try {
        // const existingOrderItem = await PurchaseOrder.findOne({
        //     'orderItem.itemName': req.body.orderItem[0].itemName
        // });
        // if (existingOrderItem) {
        //     return res.status(202).json({ message: "Already Exists" })
        // }
        const { orderBy, orderTo, orderDate, orderItem, } = req.body;
        const orderId = "P" + (await PurchaseOrder.countDocuments()) + "C" + (await PurchaseOrder.countDocuments() + 1);
        console.log(orderId);
        const purchaseOrder = new PurchaseOrder({
            orderId,
            orderBy,
            orderTo,
            orderDate,
            orderItem,
        });
        const result = await purchaseOrder.save();
        res.status(200).json({ message: "Purchase Order created Successfully" });
    } catch (err) {
        res.status(500).json(err);
    }

})


router.get("/getPurchaseOrder/:id", auth, async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findOne({
            orderDate: req.params.id
        });
        if (!purchaseOrder) {
            return res.status(404).json({ message: "Purchase Order not found" });
        } else {
            res.status(200).json(purchaseOrder);
        }

    } catch (err) {
        res.status(500).json(err);

    }
})


router.get("/getSupplierData/:id", auth, async (req, res) => {
    try {
        const supplierData = await PurchaseOrder.findOne({
            'orderTo.supplierName': req.params.id
        });
        if (!supplierData) {
            return res.status(404).json({ message: "Supplier not found" });
        } else {
            // console.log(supplierData);
            // console.log(supplierData.orderTo);
            res.status(200).json(supplierData.orderTo);
        }

    } catch (err) {
        res.status(500).json(err);

    }
})


router.get("/getProductData/:id", auth, async (req, res) => {
    try {

        const productData = await PurchaseOrder.findOne({
            'orderItem.itemName': req.params.id
        });
        if (!productData) {
            return res.status(404).json({ message: "Product not found" });
        } else {
            // console.log(productData);
            // console.log(productData.orderItem);
            res.status(200).json(productData.orderItem);
        }
    } catch (err) {
        res.status(500).json(err);

    }

})


router.get("/getPurchaseOrderData/forReceipt/:id", auth, async (req, res) => {
    const orderId = req.params.id;
    console.log("Received orderId:", orderId);
    try {
        const purchaseOrder = await PurchaseOrder.findOne({
            orderId: req.params.id
        });
        if (!purchaseOrder) {
            return res.status(404).json({ message: "Purchase Order not found" });
        } else {
            res.status(200).json(purchaseOrder);
        }

    } catch (err) {
        res.status(500).json(err);

    }

})


router.post("/storeReceiptDatas", auth, async (req, res) => {
    try {

        const { invoiceNumber, invoiceDate, supplierName, supplierContact, supplierId, productName, quantity
            , basePrice, tax, purchaseOrderId, receivingPersonName, totalAmount } = req.body;


        const receiptId = "R" + (await StoreReceipt.countDocuments() + 1) + "C";
        const storeReceipt = new StoreReceipt({
            receiptId, invoiceNumber, invoiceDate,
            supplierName, supplierContact, supplierId,
            productName, quantity
            , basePrice, tax, purchaseOrderId,
            receivingPersonName, totalAmount
        });

        const result = await storeReceipt.save();

        const findProduct = await Product.findOne({ productName: productName });
        if (findProduct) {
            const updatedQuantity = parseInt(findProduct.quantity) + parseInt(quantity);
            await Product.updateOne({ productName: productName }, { $set: { quantity: updatedQuantity } });
            res.status(200).json({ message: "Receipt Data  Successfully and quantity updated" });
        }

       
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

})



router.get("/getPurchaseInvoiceCount",auth,async(req,res)=>{
    try{
        const purchaseInvoiceCount = await StoreReceipt.countDocuments();
        // console.log(purchaseInvoiceCount);
        res.status(200).json({purchaseInvoiceCount});
    }catch(err){
        res.status(500).json({message:err.message});
    }

})


router.get("/getTotalPurchaseAmount", auth, async (req, res) => {
    try {
      const totalPurchaseAmount = await StoreReceipt.aggregate([
        {
          $addFields: {
            totalAmountNumeric: {
              $toDouble: {
                $replaceOne: {
                  input: "$totalAmount",
                  find: "₹",
                  replacement: ""
                }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalAmountNumeric" }
          }
        }
      ]);
  
      console.log(totalPurchaseAmount);
      res.status(200).json({ totalPurchaseAmount: totalPurchaseAmount[0]?.totalAmount || 0 });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



router.get("/getPurchaseOrderReport", auth, async (req, res) => {
    try {
        const { purchaseOrderFromDate, purchaseOrderToDate } = req.query;

        console.log(purchaseOrderFromDate);
        console.log(purchaseOrderToDate);

        const fromDate = new Date(purchaseOrderFromDate);
        const toDate = new Date(purchaseOrderToDate);

        console.log("From Date", fromDate);
        console.log("To Date", toDate);

        const purchaseOrderReport = await StoreReceipt.find({
            invoiceDate: {
                $gte: fromDate.toISOString(),
                $lte: toDate.toISOString()
            }
        });
        console.log(purchaseOrderReport);
        res.status(200).json(purchaseOrderReport);
    } catch (err) {
        res.status(500).json(err);
    }
}
);



  
  
  
  
  
  
  
  
  




module.exports = router;







