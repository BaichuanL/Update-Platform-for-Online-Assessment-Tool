// Load Node modules
var express = require('express');
const ejs = require('ejs');
var path = require('path');
const mongoose = require("mongoose");
var router = require('./router/index');
const bp = require("body-parser");
var cookieParser = require('cookie-parser')
// Initialise Express
var app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser("peerlessPerformance"))
//connect db
mongoose.connect("mongodb+srv://pstudy:B8j1ew502JX9r37W@dbaas-db-3086450-393104f7.mongo.ondigitalocean.com/?authMechanism=DEFAULT",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(console.log("MongoDB is properly connected "))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Render static files
app.use(express.static(path.join(__dirname, 'public')));
// Port website will run on
app.listen(8080);

// app.locals.barChartHelper = require('./public/js/bar_chart_helper');
// routes
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.render('error', {status:err.status, message:err.message});
  });