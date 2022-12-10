const mongoose = require('mongoose'),
    {Types} = mongoose;

    const DetailsSchema = new mongoose.Schema({
        _plan : {
            type: Types.ObjectId,
            ref: 'Plan'
        },
        addr: {
            type: String,
            require: true
        },
        location: {
            type: String,
            require: true
        },
        reser: Boolean,
        price: Number,
        time: Number,
        trans: String,
        memo: String,
        count: Number,
        last : {
            addr : String,
            location : String
        }
    })

module.exports = mongoose.model('Details', DetailsSchema);