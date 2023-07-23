

const { Schema, model } = require('mongoose');


const UserSchema = Schema({
    username: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    mail: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, state, ...user } = this.toObject();
    user.uid = _id;
    return user;
}


module.exports = model('User', UserSchema);