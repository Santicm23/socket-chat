
const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true
    },
    descrption: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    image:  {
        type: String
    }
});

ProductSchema.methods.toJSON = function() {
    const { __v, state, ...product } = this.toObject();
    return product;
}


module.exports = model('Product', ProductSchema);