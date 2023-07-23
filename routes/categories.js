
const { Router } = require('express');
const { check } = require('express-validator');

const { getCategories, getCategorieById, createCategorie, updateCategorieById, deleteCategorieById } = require('../controllers/categories');
const { categorieIdExists, uniqueCategorieName } = require('../helpers');
const { validateParams, validateJWT, isAdminRole } = require('../middlewares');


const router = Router();

router.get('/', getCategories);

router.get('/:id', [
    check('id').custom(categorieIdExists),
    validateParams
], getCategorieById);

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obliatorio').notEmpty(),
    check('name').custom(uniqueCategorieName),
    validateParams
], createCategorie);

router.put('/:id', [
    validateJWT,
    check('id').custom(categorieIdExists),
    check('name').custom(uniqueCategorieName),
    validateParams
], updateCategorieById);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id').custom(categorieIdExists),
    validateParams
], deleteCategorieById);


module.exports = router;