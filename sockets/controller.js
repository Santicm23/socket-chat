
const { verifyJWT } = require("../helpers");
const { ChatMensajes } = require("../models");


const chatMensajes = new ChatMensajes();

const socketController = async(socket, io) => {
    
    const user = await verifyJWT(socket.handshake.headers['x-token']);
    
    if (!user) {
        return socket.disconnect();
    }
    
    chatMensajes.conectarUsuario(user);

    socket.join(user.uid);

    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);
    
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(user.uid);
        socket.broadcast.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {

        if (uid) {
            socket.to(uid).emit('mensaje-privado', {
                de: user.username,
                mensaje
            });
        } else {
            chatMensajes.enviarMensaje(user.uid, user.username, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    });

}


module.exports = {
    socketController
}