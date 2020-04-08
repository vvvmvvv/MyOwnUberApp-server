const mongoose = require('mongoose');

//-------------------------------------------------workflow with Load
// statuses:    - NEW(for just created, but not posted yet loads) --------default
//              - POSTED(Shipper posted his load, searching for driver)
//              - ASSIGNED(Driver found and assigned)
//              - SHIPPED(finished shipment, history)
//--------------------------------------------------------------------

const loadSchema = new mongoose.Schema({
    title: {
        type: String,
        min: 3,
        max: 255
    },
    status: {
        type: String,
        default: 'NEW'
    },
    state: {
        type: String,
        default: null
    },  
    dimensions: {
        width:  {type: Number, required: true,},
        length: {type: Number, required: true,},
        height: {type: Number, required: true,},
        
    },
    payload: {
        type: Number,
        required: true,
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

module.exports = mongoose.model('loads', loadSchema );