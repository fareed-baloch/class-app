 const express = require('express');
 let app = express.Router();
 const Student = require('../models/student');
 const multer = require('multer');
 const {check , validationResult} = require('express-validator');
 const path = require('path');
//multer start

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
   // //req.flash('danger','Supported files types are /jpg|png|jpeg|gif/ ');
    cb(null ,false);
  }
}
//multer end

//student get all route
 app.get('/', (req, res) => {
    Student.find()
    .then((results)=>{
      res.render('get-all',{students:results});
    // res.send(results)
    })
    .catch(err=>{console.log(err)});
  
  });

  //create Studnet Route
app.get('/create', (req, res) => {
  res.render('students_create');
  });

//delete student route
  app.get('/delete/:id', (req, res) => {
    Student.deleteOne({_id:req.params.id})
    .then(result=>{
      req.flash('danger','students removed.');
      res.redirect('/students');
    })
    .catch(err=>{console.log(err)});
    });


    //update student route
app.get('/update/:id', (req, res) => {

  Student.findById({_id:req.params.id})
  .then(result=>{
    res.render('students-update',{student:result});
  })
  .catch(err=>{console.log(err)});
  });

  app.post('/update', (req, res) => {
    const id = req.body.id;
   
  Student.findByIdAndUpdate({_id:id},{name:req.body.name,batch:req.body.batch})
  .then(result=>{
    res.redirect('/students');
  }).catch(err=>{console.log(err)});
  });


  //student create route
app.post('/create',upload,[
  check('name','Name is required.').exists().isLength({min:3}),
  check('batch','Batch is required.').exists().isLength({min:3}),
  check('filetoupload').custom((value, {req}) => {
    if(req.file.mimetype === 'image/gif' || req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png'){
        return 'image'; // return "non-falsy" value to indicate valid data"
    }
    else{
        return false; // return "falsy" value to indicate invalid data
    }
})
.withMessage('Please only submit Image files.'), // custom error message that will be send back if the file in not a pdf. 

],(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
  {
    //console.log(req.file.mimetype);
    const alert = errors.array();
  // return res.status(400).json({ errors: errors.array() });
   res.render('students_create',{alert});
  }else{
    const student = new Student({name:req.body.name,batch:req.body.batch,image:req.file.filename})
    student.save()
    .then(results =>{
      req.flash('success','Student added');
      res.redirect('/students');
     })
    .catch(err => {console.log(err)});
  }
 

});


  module.exports = app;