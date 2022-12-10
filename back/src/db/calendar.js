const mongoose = require('mongoose'),
    {Types} = mongoose;

const CalendarSchema = new mongoose.Schema({
    _id: {
        day: {
            type: Number,
            require: true
        },
        plan: {
            type: Types.ObjectId,
            require: true,
            ref: 'Plan'
        }
    },
    point: Array, //좌표
    distance: Number, //거리
    duration: Number, //시간
    details: [{
        type: Types.ObjectId,
        ref: 'Details'
    }]
});

module.exports = mongoose.model('Calendar', CalendarSchema);