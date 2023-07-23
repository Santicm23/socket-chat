
const { Categorie } = require('../models');


const getCategories = async(req, res) => {
    const { limit = 5, from = 0 } = req.query;

    const condition = {state: true};

    const [ total, categories ] = await Promise.all([
        Categorie.countDocuments(condition),
        Categorie.find(condition)
            .skip(Number(from))
            .limit(Number(limit))
            .populate('user',  ['username', 'mail'])
    ]);

    res.json({
        total,
        categories
    });
}

const getCategorieById = async(req, res) => {
    const { id } = req.params;

    const categorie = await Categorie.findOne({_id: id, state:true}).populate('user', ['username', 'mail']);

    res.json({
        categorie
    });
}

const createCategorie = async(req, res) => {
    const { user, state } = req.body;
    const name = req.body.name.toUpperCase();
    
    const categorie = new Categorie({name, user: req.logedUser._id, state});

    await categorie.save();

    res.status(201).json(categorie);
}

const updateCategorieById = async(req, res) => {
    const { id } = req.params;
    const { _id, user, name, ...rest } = req.body;

    rest.name = name.toUpperCase();
    rest.user = req.logedUser._id;

    const categorie = await Categorie.findByIdAndUpdate(id, rest, {new: true}).populate('user');
    
    res.json(categorie);
}

const deleteCategorieById = async(req, res) => {
    const { id } = req.params;

    const categorie = await Categorie.findByIdAndUpdate(id, {
        state: false, user: req.logedUser._id
    }, {new:true}).populate('user');
    
    res.json(categorie);
}


module.exports = {
    getCategories,
    getCategorieById,
    createCategorie,
    updateCategorieById,
    deleteCategorieById
}