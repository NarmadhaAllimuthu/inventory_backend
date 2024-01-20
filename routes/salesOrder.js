

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../authorization');
const { SalesOrder } = require('../models/salesOrderModels');
const { Product } = require('../models/inventoryProductModels');

router.post("/createSalesOrder", auth, async (req, res) => {
    try {
        const { customerDetails, userShopDetails,
            productName, productQuantity, productBasePrice, productSellingPrice
            , productTax, totalAmount, salesOrderDate } = req.body;
        const findProduct = await Product.findOne({ productName: req.body.productName });

        if (findProduct) {
            const updatedQuantity = parseInt(findProduct.quantity) - parseInt(req.body.productQuantity);

            if (updatedQuantity >= 0) {
                await Product.updateOne({ productName: productName }, { $set: { quantity: updatedQuantity } });

                const salesOrderId = "SO" + (await SalesOrder.countDocuments() + 1) + "ID";
                console.log(salesOrderId);
                const salesOrder = new SalesOrder({
                    salesOrderId,
                    customerDetails,
                    userShopDetails,
                    salesOrderDate,
                    productName,
                    productQuantity,
                    productBasePrice,
                    productSellingPrice,
                    productTax,
                    totalAmount
                });
                console.log(salesOrder);

                const result = await salesOrder.save();
                console.log(result);

                console.log('Quantity updated successfully');
                res.status(200).json({ message: "Sales Order Created successfully! Quantity updated" });
            } else {
                // If the updated quantity is negative, it means insufficient stock
                console.error('Insufficient stock for the product:', productName);
                res.status(400).json({ message: 'Insufficient stock for the product' });
            }
        } else {
            // Handle the case where the product does not exist
            console.error('Product not found:', productName);
            res.status(400).json({ message: 'Product not found' });
        }



    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});



router.get("/getSalesOrderDatas/:id", auth, async (req, res) => {
    try {
        const salesOrderData = await SalesOrder.findOne({
            salesOrderDate: req.params.id
        });
        if (!salesOrderData) {
            return res.status(404).json({ message: "Sales Order not found" });
        } else {

            res.status(200).json(salesOrderData);
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})


router.get("/getSalesOrderCount", auth, async (req, res) => {
    try {
        const salesOrderCount = await SalesOrder.countDocuments();
        // console.log(salesOrderCount);
        res.status(200).json({ salesOrderCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get("/getTotalSalesAmount", auth, async (req, res) => {
    try {
        const totalSalesAmount = await SalesOrder.aggregate([
            {
                $addFields: {
                    totalAmountNumeric: { $toDouble: "$totalAmount" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmountNumeric" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAmount: 1
                }
            }
        ]);

        console.log(totalSalesAmount);
        res.status(200).json({ totalSalesAmount: totalSalesAmount[0]?.totalAmount || 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




router.get("/getSalesOrderReport", auth, async (req, res) => {
    try {
        const { salesOrderFromDate, salesOrderToDate } = req.query;
        // console.log(salesOrderFromDate);
        // console.log(salesOrderToDate);

        const fromDate = new Date(salesOrderFromDate);
        const toDate = new Date(salesOrderToDate);

        // console.log("From Date",fromDate);
        // console.log("To Date",toDate);

        const salesOrderReport = await SalesOrder.find({
            salesOrderDate: { $gte: fromDate.toISOString(), $lte: toDate.toISOString() }
          });
          

        console.log(salesOrderReport);

        if (!salesOrderReport || salesOrderReport.length === 0) {
            return res.status(404).json({ message: "No Sales Order Found" });
        }
        console.log(salesOrderReport);
        res.status(200).json(salesOrderReport);


    } catch (err) {

        res.status(500).json({ message: err.message })
    }
})












module.exports = router;




