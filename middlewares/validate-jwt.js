
const jwt = require('jsonwebtoken');
const { User } = require('../models');


const validateJWT = async(req, res, next) => {
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(400).json({
            msg: 'No se mando ningún token'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        req.logedUser = await User.findById(uid);
        if (!req.logedUser.state){
            return res.status(401).json({
                msg : 'Token no valido - state'
            })
        }

        if (!req.logedUser){
            return res.status(401).json({
                msg : 'Token no valido - no existe el usuario'
            })
        }

        next();
    } catch (error) {
        res.status(401).json({
            msg: 'token no válido',
            error
        })
    }  
}

module.exports = {
    validateJWT
}