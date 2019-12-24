const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    pwHash: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform: (doc, ret) => {
            delete ret.pwHash;
        }
    }
});

schema.virtual('password')
    .set(function(password){
        this.pwHash = bcrypt.hashSync(password, 14);
    });

module.exports = mongoose.model('User', schema);
