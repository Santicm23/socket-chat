
const { Router } = require('express');
const { check } = require('express-validator');

const { getProducts, getProductById, createProduct, updateProductById, deleteProductById } = require('../controllers/products');
const { productIdExists, uniqueProductName, categorieIdExists } = require('../helpers');
const { validateParams, validateJWT, isAdminRole } = require('../middlewares');


const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    check('id').custom(productIdExists),
    validateParams
], getProductById);

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obliatorio').notEmpty(),
    check('name').custom(uniqueProductName),
    check('categorie', 'No es un id de mongo válido').isMongoId(),
    check('categorie').custom(categorieIdExists),
    validateParams
], createProduct);

router.put('/:id', [
    validateJWT,
    check('id').custom(productIdExists),
    check('name').custom(uniqueProductName),
    validateParams
], updateProductById);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id').custom(productIdExists),
    validateParams
], deleteProductById);


module.exports = router;