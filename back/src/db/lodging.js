const mongoose = require('mongoose'),
    {Types} = mongoose;

    const LodgingSchema = new mongoose.Schema({
        _plan : {
            type: Types.ObjectId,
            ref: 'Plan'
        },
        addr: {
            type: String,
            require: true
        },
        check_in : Date,
        check_out : Date,
        reser: Boolean,
        price: Number,
        lodg: Number,
        memo: String
    });

    module.exports = mongoose.model('Lodging', LodgingSchema);