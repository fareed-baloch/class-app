
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');


//student model
const Student = require('./models/student');

//routes
const students = require('./routes/student');
const users = require('./routes/users');


//making a static folder for our app to allow a client to access the files
app.use(express.static(__dirname + '/public'));
//seting up view engine as ejs
app.set('view engine','ejs');

//mongooose setup
mongoose.connect('mongodb://localhost/crudapp', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDB connected")
});

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

////

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


///





//////

//route to index page
app.get('/', (req, res) => {
  res.render('index')
})

app.use('/students',students);
app.use('/users',users);


//starting app 
app.listen(port, () => {
  console.log('server running at '+port);
})



