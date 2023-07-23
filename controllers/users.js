
const { encrypt } = require('../helpers');
const { User } = require('../models')


const getUsers = async(req, res) => {

    const { limit = 5, from = 0 } = req.query;

    const condition = {state: true};

    const [ total, users ] = await Promise.all([
        User.countDocuments(condition),
        User.find(condition)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

const createUser = async(req, res) => {
    const { username, mail, password, role } = req.body;

    try {
        const user = new User({username, mail, password: encrypt(password), role});

        await user.save();
        
        res.status(201).json(user);

    } catch (error) {
        console.log(error);
        
    }

}

const updateUser = async(req, res) => {
    const { id } = req.params;
    const { _id, password, google, mail, ...rest } = req.body;

    if (password) {
        rest.password = encrypt(password);
    }

    const user = await User.findByIdAndUpdate(id, rest, {new: true});
    
    res.json(user);
}

const deleteUser = async(req, res) => {
    const { id } = req.params;

    const logedUser = req.logedUser;

    const user = await User.findByIdAndUpdate(id, {state: false});

    res.json({user, logedUser});
}


module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}