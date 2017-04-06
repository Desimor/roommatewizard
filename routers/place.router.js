const express = require('express');
const router = express.Router();
const Place = require('../models/place.model');
const _ = require('lodash');
const signature = process.env.SIGNATURE || require('../secrets').SIGNATURE;
const expressJWT = require('express-jwt');
const auth = expressJWT({
    secret: signature,
    userProperty: 'payload'
});

router.get('/places', auth, function(req, res){
    Place.find({author: req.payload._id}, function(err, posts){
        if(err){
            res.status(500).json({
                msg: err
            });
        } else {
            res.status(200).json({
                places: places
            });
        }
    });
});
router.get('/places/:id', function(req, res){
    Place.find({_id: req.params.id}, function(err, places){
        if(err){
            res.status(500).json({
                msg: err
            });
        } else {
            res.status(200).json({
                places: places
            });
        }
    });
});
router.post('/places', function(req, res){
    var place = new Place(req.body);
    place.save(function(err){
        if(err){
            res.status(500).json({
                msg: err
            });
        } else {
            res.status(201).json({
                msg: 'Created a place successfully.'
            });
        }
    });
});
router.delete('/places/:id', auth, function(req, res){
    Place.removed({_id: req.params.id, author: req.payload._id}, function(err, place){
        if(err){
            res.status(500).json({
                msg: err
            });
        } else if(!place){
            res.status(403).json({
                msg: 'Unauthorized'
            });
        } else {
            res.status(200).json({
                msg: 'Successfully deleted'
            });
        }
    });
});
router.get('/place/random/:number', function(req, res){
    var number = req.params.number;
    Place.find({})
            .populate('author', 'name')
            .exec(function(err, places){
                if(err){
                    res.status(500).json({
                        msg: err
                    });
                } else {
                    res.status(200).json({
                        places: _.sampleSize(places, number)
                    })
                }
            });
});
module.exports = router;