const mongoose = require('mongoose'),
    {Types} = mongoose;

    const DetailsSchema = new mongoose.Schema({
        addr: {
            type: String,
            require: true
        },
        name: {
            type: String,
            require: true
        },
        reser: Boolean,
        price: Number,
        time: Number,
        trans: String,
        memo: String,
        orders: {
            arr: {
                type: Boolean,
                require: true
            },
            order: {
                type: Number,
                require: true
            }
        }
    })

module.exports = mongoose.model('Details', DetailsSchema);