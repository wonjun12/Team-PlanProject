const mongoose = require('mongoose'),
    {Types} = mongoose;
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    emailCk: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
  });

UserSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 5);
});

module.exports = mongoose.model('User', UserSchema);