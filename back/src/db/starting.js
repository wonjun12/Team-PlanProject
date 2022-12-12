const mongoose = require('mongoose'),
    {Types} = mongoose;

    const StartingSchema = new mongoose.Schema({
        _plan : {
            type: Types.ObjectId,
            ref: 'Plan'
        },
        addr: {
            type: String,
            require: true
        },
        time: {
            type: Date,
            require: true
        },
        trans: String,
        memo: String
    });

    module.exports = mongoose.model('Starting', StartingSchema);