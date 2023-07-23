

const form = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'http://172.22.9.136:8080/api/auth/';

form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = {};

    for (const el of form.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    console.log(url);

    fetch(`${url}login`, {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(resp => resp.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(err => console.error(err));

});

function handleCredentialResponse(response) {
    // Google token
    // console.log('ID TOKEN: ',response.credential);
    fetch(`${url}google`, {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify({id_token: response.credential})
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
}

const button = document.getElementById("google_signout");
button.onclick = () => {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('mail'), done => {
        localStorage.clear();
        location.reload();
    });
}