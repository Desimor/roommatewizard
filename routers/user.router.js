const express = require('expess');
const router = express.Router();
const User = require('../models/user.model');
const passport = require('passport');
const signature = process.env.SIGNATURE || require('../secrets').SIGNATURE;
const expressJWT = require('express-jwt');
const auth = expressJWT({
    secret: signature,
    userProperty: 'payload'
});

router.post('/signup', function(req, res){
    var user = new User(req.body);
    user.setPassword(req.body.password);
    user.save(function(err){
        if(err){
            res.status(500).json({
                msg: err
            });
        } else {
            res.status(201).json({
                msg: 'You successfully signed up.'
            });
        }
    });
});
router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, data){
        if(err){
            return res.status(500).json({
                msg: err
            });
        }
        if(!user){
            return res.status(404).json({
                msg: 'The username and/or password you have provided is incorrect.'
            });
        }
        if(user && !user.validPassword(req.body.password)){
            return res.status(401).json({
                msg: 'The username and/or password you have provided is incorrect.'
            });
        }
        return res.status(200).json({
            token: user.generateJwt()
        });
    })(req, res, next);
});