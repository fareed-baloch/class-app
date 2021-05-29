
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

//student model
const Student = require('./models/student');


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
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//seting up multer file storage 

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function (req, file, cb) {
    cb(null, 'myapp '+ Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('filetoupload');

function checkFileType(file, cb) {
  const filetypes = /jpg|png|jpeg|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('ERROR : Images only !');
  }
}


//////

//route to index page
app.get('/', (req, res) => {
  res.render('index')
})
//create Studnet Route
app.get('/students/create', (req, res) => {
res.render('students_create');
});

app.post('/students/create',upload,(req, res) => {

   const student = new Student({name:req.body.name,batch:req.body.batch,image:req.file.filename})
 student.save()
 .then(results =>{res.redirect('/students');})
 .catch(err => {console.log(err)});

});
//get all studnet route
app.get('/students', (req, res) => {
  Student.find()
  .then((results)=>{
    res.render('get-all',{students:results});
  // res.send(results)
  })
  .catch(err=>{console.log(err)});

});

app.get('/students/delete/:id', (req, res) => {

Student.deleteOne({_id:req.params.id})
.then(result=>{
  res.redirect('/students');
})
.catch(err=>{console.log(err)});
});

app.get('/students/update/:id', (req, res) => {

  Student.findById({_id:req.params.id})
  .then(result=>{
    res.render('students-update',{student:result});
  })
  .catch(err=>{console.log(err)});
  });

app.post('/students/update', (req, res) => {
  const id = req.body.id;
 
Student.findByIdAndUpdate({_id:id},{name:req.body.name,batch:req.body.batch})
.then(result=>{
  res.redirect('/students');
}).catch(err=>{console.log(err)});
});

//starting app 
app.listen(port, () => {
  console.log('server running at '+port);
})



