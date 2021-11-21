const submitRegistration = () => {
    const email = $('#regEmail').val();
    const password = $('#regPassword').val();
    const username = $('#regUsername').val();

    if (!email) throw new Error('Введите email');
    if (!password) throw new Error('Введите пароль');
    if (!username) throw new Error('Введите имя пользователя')

    const message = {
        user: {
            username: username,
            email: email,
            password: password
        }
    }

    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(message)
    })
        .then(res => res.json())
        .then(res => {
            if (res.user) {
                setCookie('AuthToken', `${res.user.token}`, {'max-age': 24*60*60})
                console.log(res.user)
            } else {
                throw new Error(res.errors.body)
            }
        })
        .catch(e => {
            throw new Error(e)
        })
}

const setCookie = (name, value, options = {}) => {
    options = {
        path: '/',
        ...options
    };
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}

$(document).ready(() => {
    $('#regSubmit').click(() => {
        submitRegistration()
    })
})