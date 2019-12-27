const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: [true, 'Email is taken']
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

schema.statics.authorize = async function({ email, password }){
    const user = await this.findOne({ email });
    if(!user){
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
    }
    const validPassword = await bcrypt.compare(password, user.pwHash);
    if(!validPassword){
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
    }
    return user;
};

schema.methods.authToken = function(){
    return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
        expiresIn: '24h'
    });
};

module.exports = mongoose.model('User', schema);
