
const mongoose = require('mongoose');


const dbConnection = async() => {
    try {

        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGO_ATLAS);

        console.log('base de datos conectada');
        
    } catch (error) {
        console.error(error);
        throw new Error('Error en la base de datos')
        
    }
}


module.exports = {
    dbConnection
}