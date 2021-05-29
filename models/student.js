const mongoose = require('mongoose');

const Studentshecma = new mongoose.Schema({
    name: {type:String,required:true},
    batch: {type:String,required:true},
    image: {type:String,required:true}

  },{timestamps:true});
  //it will look for Students collection in side a which ever db you have selected in DB Connection String
  //Student = Students
  const Student = mongoose.model('Student', Studentshecma);
  module.exports = Student;
  

