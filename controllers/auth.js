
const { isPass } = require('../helpers/encrypt');
const { generateJWT, googleVerify } = require('../helpers');
const { User } = require('../models')


const login = async(req, res) => {
    const { mail, password } = req.body;
    try {

        const user = await User.findOne({mail});
        if (!user){
            return res.status(400).json({
                msg: "El correo o la contraseña no son correctos - mail"
            });
        }

        if (!user.state){
            return res.status(400).json({
                msg: "El correo o la contraseña no son correctos - state",
            });
        }

        if (!isPass(password, user.password)){
            return res.status(400).json({
                msg: "El correo o la contraseña no son correctos - password"
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}

const googleSignIn = async(req, res) => {

    const { id_token } = req.body;

    try {
        const { username, mail, image } = await googleVerify(id_token);

        let user = await User.findOne({mail});

        if (!user) {
            user = new User({
                username,
                mail,
                password: ':P',
                image,
                google: true
            });

            await user.save();

        } else if (!user.state) {
            return res.status(401).json({
                msg: 'El usuario no se encuentra activo'
            });
        }
        
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            msg: 'El token no se pudo verificar',
            error
        });
    }

}

const renewToken = async(req, res) => {
    const { logedUser } = req;

    const token = await generateJWT(logedUser.id);

    res.json({
        token,
        logedUser
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}