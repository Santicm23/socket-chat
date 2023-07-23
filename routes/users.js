
const { Router } = require('express');
const { check } = require('express-validator');

const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');
const { roleExists, uniqueMail, uidExists } = require('../helpers');
const { validateJWT, validateParams, isAdminRole, hasRole } = require('../middlewares');


const router = Router();

router.get('/', getUsers);

router.post('/', [
    check('username', 'El nombre es obligatorio').notEmpty(),
    check('password', 'La contraseña debe tener 6 letras o más').isLength({min: 6}),
    check('mail', 'El correo no es válido').isEmail(),
    check('role').custom(roleExists),
    check('mail').custom(uniqueMail),
    validateParams
], createUser);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(uidExists),
    check('role').custom(roleExists),
    validateParams
], updateUser);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    // hasRole('ADMIN_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(uidExists),
    validateParams
], deleteUser);


module.exports = router;