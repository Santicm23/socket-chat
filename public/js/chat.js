

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'http://172.22.9.136:8080/api/auth/';

let user;
let socket;

const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


const validateJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('El token no es valido');
    }

    const resp = await fetch(url, {
        headers: {
            'x-token': token
        }
    });
    
    if (resp.status > 400) {
        window.location = 'index.html';
        throw new Error('El token no es valido');
    }

    const { logedUser, token: newToken } = await resp.json();
    user = logedUser;
    localStorage.setItem('token', newToken);
    document.title = user.username;

    await conectarSocket();
}

const conectarSocket = async() => {
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {});

    socket.on('disconnect', () => {});

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', (payload) => {
        console.log(payload);
    });
    
    txtMensaje.addEventListener('keyup', ({ keyCode }) => {
        const uid = txtUid.value;
        const mensaje = txtMensaje.value;
    
        if (keyCode !== 13 || mensaje.length === 0) return;
    
        socket.emit('enviar-mensaje', {
            uid,
            mensaje
        });

        txtMensaje.value = '';
    
    });

}

const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(({ uid, username }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${username}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });
    ulUsuarios.innerHTML = usersHtml;
}

const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary">${nombre}:</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `
    });
    ulMensajes.innerHTML = mensajesHtml;
}


const main = async() => {
    await validateJWT();
}

main();