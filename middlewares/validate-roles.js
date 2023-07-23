

const isAdminRole = (req, res, next) => {
    if (!req.logedUser){
        res.status(500).json({
            msg: 'Primero valida el token'
        })
    }

    const { role, name } = req.logedUser;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `El usuario ${name} no es administrador - no puede ejecutar esta acción`
        });
    }

    next();
}

const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.logedUser){
            res.status(500).json({
                msg: 'Primero valida el token'
            })
        }

        if (!roles.includes(req.logedUser.role)){
            return res.status(401).json({
                msg: `El role no esta entre los siguientes roles: ${roles}`
            })
        }
        next();
    }
}


module.exports = {
    isAdminRole,
    hasRole
}