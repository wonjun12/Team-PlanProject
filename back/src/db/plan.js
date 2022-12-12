const mongoose = require('mongoose'),
    {Types} = mongoose;

const PlanSchema = new mongoose.Schema({
    _user: {
        type: Types.ObjectId,
        require: true,
        ref: 'User'
    },
    title: {
        type: String,
        require: true
    },
    start: {
        type: Date,
        require: true
    },
    end: {
        type: Date,
        require: true
    },
    starting: {
        type: Types.ObjectId,
        ref: 'Starting'
    },
    lodging: [{
        type: Types.ObjectId,
        ref: 'Lodging'
    }]
},{
    timestamps: true,
})

module.exports = mongoose.model('Plan', PlanSchema);