const mongoose = require('mongoose'),
    {Types} = mongoose;

    //소진 추가
    const DetailsSchema = new mongoose.Schema({
        _plan : {
            type: Types.ObjectId,
            ref: 'Plan'
        },
        day: {
            type: Number,
            require: true
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