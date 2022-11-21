const mongoose = require('mongoose'),
    {Types} = mongoose;

    const StartingSchema = new mongoose.Schema({
        addr: {
            type: String,
            require: true
        },
        start: {
            type: Date,
            require: true
        },
        trans: String,
        memo: String
    });

    module.exports = mongoose.model('Starting', StartingSchema);