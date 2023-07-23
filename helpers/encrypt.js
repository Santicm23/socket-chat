
const bcryptjs = require('bcryptjs');


const encrypt = (password) => bcryptjs.hashSync(password, bcryptjs.genSaltSync());

const isPass = bcryptjs.compareSync;

module.exports = {
    encrypt,
    isPass
};