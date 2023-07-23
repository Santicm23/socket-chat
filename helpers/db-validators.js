
const { Role, User, Categorie, Product } = require('../models');


const roleExists = async(role) => {
    const existRole = await Role.findOne({role});
    if (!existRole){
        throw new Error(`El rol '${role}' no es válido`)
    }
}

const uniqueMail = async(mail) => {
    const existUser = await User.findOne({mail});
    if (existUser){
        throw new Error(`El correo '${mail}' ya se encuentra en uso`)
    }
}

const uidExists = async(id) => {
    const existUser= await User.findById(id);
    if (!existUser){
        throw new Error(`El id de usuario '${id}' no existe`)
    }
}

const categorieIdExists = async(id) => {
    const existCategorie= await Categorie.findById(id);
    if (!existCategorie){
        throw new Error(`El id de categoria '${id}' no existe`)
    }
}

const productIdExists = async(id) => {
    const existProduct= await Product.findById(id);
    if (!existProduct){
        throw new Error(`El id de producto '${id}' no existe`)
    }
}

const uniqueCategorieName = async(name, { req }) => {
    name = name.toUpperCase();
    const existName = await Categorie.findOne({name});
    if (existName && req.params.id!==existName._id.toString()){
        throw new Error(`El nombre '${name}' ya se encuentra en uso`)
    }
}

const uniqueProductName = async(name, { req }) => {
    name = name?.toUpperCase();
    const existName = await Product.findOne({name});
    if (existName && req.params.id!==existName._id.toString()){
        throw new Error(`El nombre '${name}' ya se encuentra en uso`)
    }
}

const autorizedCollections = async(collection, collections) => {
    if (!collections.includes(collection)){
        throw new Error(`La colección ${collection} no es permitida desde este endpoint`);
    }
}


module.exports = {
    roleExists,
    uniqueMail,
    uidExists,
    categorieIdExists,
    productIdExists,
    uniqueCategorieName,
    uniqueProductName,
    autorizedCollections
}