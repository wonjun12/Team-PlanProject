const mongoose = require('mongoose'),
    {Types} = mongoose;

    const LodgingSchema = new mongoose.Schema({
        addr: {
            type: String,
            require: true
        },
        reser: Boolean,
        pice: Number,
        lodg: Number,
        memo: String
    });

    module.exports = mongoose.model('Lodging', LodgingSchema);