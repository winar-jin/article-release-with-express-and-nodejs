const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users.js');
const passport = require('passport');

router.get('/register',(req,res) => {
    res.render('register');
});

router.post('/register',(req,res) => {
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;
    console.log(username);
    req.checkBody('name','Name can not be empty!').notEmpty();
    req.checkBody('username','Username can not be empty!').notEmpty();
    req.checkBody('email','Email can not be empty!').notEmpty();
    req.checkBody('email','It is not email address!').isEmail();
    req.checkBody('password','Password can not be empty!').notEmpty();
    req.checkBody('password2','Do not match your password!').equals(password);
    let errors = req.validationErrors();
    if(!errors){
        let user = new User({
            name: name,
            password: password,
            email: email,
            username: username
        });

        bcrypt.genSalt(10,(err,salt) => {
            if(err){
                console.log(err);
                return;
            } else {
                bcrypt.hash(password,salt,(err,hash) => {
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        user.password = hash;
                        user.save((err) => {
                            if(err){
                                console.log(err);
                                return;
                            } else {
                                req.flash('success','Register success, You can login now');
                                res.redirect('/users/login');
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.render('register',{
            errors:errors
        });
    }
});

router.get('/login',(req,res) => {
    res.render('login');
});

router.post('/login',(req,res,next) => {
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req,res,next);
});

router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success','you were log out');
    res.redirect('/users/login');
});


module.exports = router;