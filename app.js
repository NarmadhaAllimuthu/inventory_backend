var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

var app = express();
// "https://deploy-preview-3--guileless-kangaroo-9838ad.netlify.app",
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
}));

var indexRouter = require('./routes/index');
var userCreationRouter = require('./routes/user-creation');
const supplierRouter = require('./routes/supplier');
const inventoryProductRouter = require('./routes/inventoryProduct');
const purchaseOrderRouter = require('./routes/purchaseOrder');
const customerRouter = require('./routes/customer');
const salesOrderRouter = require('./routes/salesOrder');
const paymentRouter = require('./routes/payment');




<<<<<<< HEAD
=======
app.use(cors({
  // origin: "https://deploy-preview-3--guileless-kangaroo-9838ad.netlify.app",
  origin:"*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
}));
>>>>>>> 8a3040dd03244bc064f410ce66f52771748677aa

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user-creation', userCreationRouter);
app.use('/supplier', supplierRouter);
app.use('/inventoryProduct', inventoryProductRouter);
app.use('/purchaseOrder', purchaseOrderRouter);
app.use("/customer",customerRouter);
app.use("/salesOrder",salesOrderRouter);
app.use("/payment", paymentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.get("/", (req, res) => {
  res.send("hello ! server is ready")
})

module.exports = app;

app.listen(3005);



