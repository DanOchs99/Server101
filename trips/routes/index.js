const User = require('../user')

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const BCRYPT_SALT_ROUNDS = 12;

let msg = '' // this is for responses from the login routine
let r_msg = '' // this is for responses from the register routine

// display login page
router.get('/',(req,res) => {
    res.render('login',{message: msg});
});

// user login endpoint
router.post('/',(req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    let user = users.find((u) => { return u.username == username; });
    if (user) {
        bcrypt.compare(password, user.hashedPassword)
            .then((samePassword) => {
                if(!samePassword) {
                    req.session.isAuthenticated = false;
                    req.session.username = '';
                    msg = `No record for that username and password.`;
                    res.redirect('/');
                }
                else {
                    msg = '';
                    req.session.isAuthenticated = true;
                    req.session.username = username;
                    res.redirect('/trips');
                }
            })
            .catch((error) => {
                console.log(`Error authenticating user ${username}`);
                console.log(error);
                req.session.isAuthenticated = false;
                req.session.username = '';
                msg = `Error authenticating user ${username}`;
                res.redirect('/');
            })
        }
    else {
      // user not found
      req.session.isAuthenticated = false;
      req.session.username = '';
      msg = `No record for that username and password.`;
      res.redirect('/');
    }
});

// diplay register page
router.get('/register',(req,res) => {
    res.render('register',{message: r_msg});
});

// user register handler
router.post('/register', (req,res) => {
    // create a new user record
    let username = req.body.username;
    let password = req.body.password;
    
    // see if user already exists...
    let user = users.find((u) => { return u.username == username; });
    if (user) {
        console.log(`Error creating user ${username}`);
        r_msg = `Error creating user ${username}`;
        res.redirect('/register');
    }
    else {
    // create the new user
        bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
        .then((hashedPassword) => {
            users.push(new User(username, hashedPassword));
            console.log(`Created user ${username}`);
            res.redirect('/');
        })
        .catch((error) => {
            console.log(`Error creating user ${username}`);
            console.log(error);
            r_msg = `Error creating user ${username}`;
            res.redirect('/register');
        });
    }
});

router.get('/logoff', (req,res) => {
    req.session.isAuthenticated = false;
    req.session.username = '';    
    res.redirect('/');
});

module.exports = router;