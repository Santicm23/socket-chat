
const { Router } = require('express');
const { check } = require('express-validator');

const { validateParams, validateJWT } = require('../middlewares');
const { login, googleSignIn, renewToken } = require('../controllers/auth');


const router = Router();

router.post('/login', [
    check('mail', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validateParams
], login);

router.post('/google', [
    check('id_token', 'El id_token es necesario').notEmpty(),
    validateParams
], googleSignIn);

router.get('/', validateJWT, renewToken);


module.exports = router;