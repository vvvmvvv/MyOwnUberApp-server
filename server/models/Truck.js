const mongoose = require('mongoose');

//-------------------------------------------------work flow with truck
// status: IS(in service) ----------->>> OL(on load)

// type:  - SPRINTER(300*250*170, 1700),
//        - SMALL STRAIGHT(500*250*170, 2500),
//        - LARGE STRAIGHT(700*350*200, 4000) 
//--------------------------------------------------------------------


const truckSchema = new mongoose.Schema({
    title: {
        type: String,
        min: 3,
        max: 255
    },
    status: {
        type: String,
        default: 'IS'
    },
    type: {
        type: String,
        required: true
    },
    payload: {
        type: Number
    },
    created_by: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    assigned_to: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    dates: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('trucks', truckSchema );