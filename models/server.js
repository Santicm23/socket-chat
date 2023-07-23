
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            search: '/api/buscar',
            users: '/api/usuarios',
            categories: '/api/categorias',
            products: '/api/productos',
            uploads: '/api/uploads'
        }

        this.conectDB();

        this.middlewares();

        this.routes();

        this.sockets();
    }

    async conectDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(express.static('public'));

        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}


module.exports = Server;