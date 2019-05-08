const express = require("express")
const hbs = require('hbs');
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const querystring = require('querystring')

// //Connect to Mongoose
mongoose.connect('mongodb://localhost/movies-with-reference', {useNewUrlParser: true}, (err, x) => {
  if(!err)console.log("connected to mongoose")
  else console.log("cannot connect to mongoose", err)
})

// //Register Partials and Set View Engine
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./public/routes/index'));
app.use('/', require('./public/routes/celebrities'));
app.use('/', require('./public/routes/movies'));

app.listen(3000, () => {
  console.log("listening Vidal")
})