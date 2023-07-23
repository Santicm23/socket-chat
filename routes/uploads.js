
const { Router } = require('express');
const { check } = require('express-validator');

const { loadFile, updateImg, getUserImg, updateImgCloudinary, getUserImgClodinary } = require('../controllers/uploads');
const { autorizedCollections } = require('../helpers');
const { validateParams, validateFileToUpload } = require('../middlewares');


const router = Router();

router.get('/:collection/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('collection').custom(c => autorizedCollections(c, ['users', 'products'])),
    validateParams
], getUserImgClodinary)
// ], getUserImg)

router.post('/', validateFileToUpload, loadFile);

router.put('/:collection/:id', [
    validateFileToUpload,
    check('id', 'No es un id válido').isMongoId(),
    check('collection').custom(c => autorizedCollections(c, ['users', 'products'])),
    validateParams
], updateImgCloudinary);
// ], updateImg);


module.exports = router;