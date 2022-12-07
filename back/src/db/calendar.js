const mongoose = require('mongoose'),
    {Types} = mongoose;

const CalendarSchema = new mongoose.Schema({
    _id: {
        day: {
            //소진 수정
            type: Date,
            require: true
        },
        plan: {
            type: Types.ObjectId,
            require: true,
            ref: 'Plan'
        }
    },
    point: Array, //좌표
    distance: Array, //거리
    duration: Array, //시간
    details: [{
        type: Types.ObjectId,
        ref: 'Details'
    }]
});

module.exports = mongoose.model('Calendar', CalendarSchema);