
const { Product } = require('../models');


const getProducts = async(req, res) => {
    const { limit = 5, from = 0 } = req.query;

    const condition = {state: true};

    const [ total, products ] = await Promise.all([
        Product.countDocuments(condition),
        Product.find(condition)
            .skip(Number(from))
            .limit(Number(limit))
            .populate('user', ['username', 'mail'])
            .populate('categorie', 'name')
    ]);

    res.json({
        total,
        products
    });
}

const getProductById = async(req, res) => {
    const { id } = req.params;

    const product = await Product.findOne({_id: id, state:true}).populate('user').populate('categorie');

    res.json({
        product
    });
}

const createProduct = async(req, res) => {
    const { user, categorie, price, state, description, available } = req.body;
    const name = req.body.name.toUpperCase();
    
    
    const product = new Product({
        name, user: req.logedUser._id,
        categorie, price, state,
        description, available
    });

    await product.save();

    res.status(201).json(product);
}

const updateProductById = async(req, res) => {
    const { id } = req.params;
    const { _id, name, ...rest } = req.body;

    rest.name = name?.toUpperCase();

    const product = await Product.findByIdAndUpdate(id, rest, {new: true}).populate('user').populate('categorie');
    
    res.json(product);
}

const deleteProductById = async(req, res) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, {
        state: false,
        user: req.logedUser._id
    }, {new:true}).populate('user').populate('categorie');
    
    res.json(product);
}


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
}