const express = require('express');
const app = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {
    check,
    validationResult
} = require('express-validator');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth');

app.get('/', (req, res) => {

    User.find()
    .then((results)=>{
      res.render('users',{users:results});
    // res.send(results)
    })
    .catch(err=>{console.log(err)});

});

app.get('/create', (req, res) => {
    res.render('user_create')
});





app.post('/create', [
    check('name', 'Name is Required').exists().isLength({
        min: 3
    }),
    check('email', 'Email is Required').exists().isEmail({
        min: 3
    }),
    check('email').custom(value =>{
        return User.findOne({email:value}).then(user=>{
            if(user)
            {
             return Promise.reject('E-mail already in use');
            }
        })
    }),
    //checking password exists
    check('password','Password is Required Password Must be atleast 6 character').exists().isLength({
        min: 6
    }),
    //matching passwords
    check('password2').custom((value,{req})=>{
        if (value !== req.body.password) {
            return Promise.reject('Password confirmation does not match password');
            }
            else{

                return true;
            }
    })   

], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render('user_create', {
            alert
        });
    } else {
            const newuser = new User ({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                role:req.body.role
            })
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    if(err){throw err}

                    newuser.password = hash;
                    newuser.save()
                    .then(user =>{
                        req.flash('success','New User added.');
                        res.redirect('/users');
                    })
                    .catch(err =>console.log(err))
                });
            });     
    }
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res, next) => {
    
    passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true })(req, res,next)
});

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success','you are logged out');
    res.redirect('/users/login');
});







module.exports = app;