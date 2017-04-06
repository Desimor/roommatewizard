const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    author: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

postSchema.pre('findOneAndUpdate', function(){
    this.update({}, {$set: {updated: Date.now()}});
});

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;