
const { isValidObjectId } = require("mongoose");
const { User, Categorie, Product } = require("../models");


const collections = [
    'categories',
    'products',
    'roles',
    'users'
];

const searchUsers = async(term, res) => {
    const isMongoId = isValidObjectId(term);

    if (isMongoId){
        const user = await User.findById(term);
        res.json({
            results: user? [user] : []
        })
    }

    const regex = new RegExp(term, 'i');

    const filter = {
        $or: [
            {name: regex},
            {mail: regex}
        ],
        $and: [{state: true}]
    }

    const users = await User.find(filter);

    const total = await User.count(filter);

    return res.json({
        total,
        results: users
    });
}

const searchCategories = async(term, res) => {
    const isMongoId = isValidObjectId(term);

    if (isMongoId){
        const categorie = await Categorie.findById(term)
            .populate('user', 'username');
        res.json({
            results: categorie? [categorie] : []
        })
    }

    const regex = new RegExp(term, 'i');

    const filter = {name: regex, state: true};

    const categories = await Categorie.find(filter)
        .populate('user', 'username');

    const total = await Categorie.count(filter);

    return res.json({
        total,
        results: categories
    });
}

const searchProducts = async(term, res) => {
    const isMongoId = isValidObjectId(term);

    if (isMongoId){
        const product = await Product.findById(term)
            .populate('categorie', 'name');
        res.json({
            results: product? [product] : []
        })
    }

    const regex = new RegExp(term, 'i');

    const filter = {name: regex, state: true, available: true};

    const products = await Product.find(filter)
        .populate('categorie', 'name');

    const total = await Product.count(filter);

    return res.json({
        total,
        results: products
    });
}

const search = async(req, res) => {

    const { collection, term } = req.params;

    if (!collections.includes(collection)){
        return res.status(400).json({
            msg: `Las collecciones permitidas son: ${collections}`
        })
    }

    switch (collection) {
        case 'categories':
            await searchCategories(term, res);
        break;
        case 'products':
            await searchProducts(term, res);
        break;
        case 'users':
            await searchUsers(term, res);
        break;
    
        default:
            res.status(500).json({
                msg: `La función de búsqueda en la colección '${collection}' aún no esta implementada :,(`
            })
    }
}


module.exports = {
    search
}