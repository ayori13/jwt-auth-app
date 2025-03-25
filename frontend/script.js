const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const getDataButton = document.getElementById('getDataButton');
const resultDiv = document.getElementById('result');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        resultDiv.textContent = data.message;
    } catch (error) {
        resultDiv.textContent = 'Ошибка при регистрации: ' + error;
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            resultDiv.textContent = 'Успешный вход! Токен сохранен.';
        } else {
            resultDiv.textContent = 'Ошибка при входе: ' + data.message;
        }
    } catch (error) {
        resultDiv.textContent = 'Ошибка при входе: ' + error;
    }
});

getDataButton.addEventListener('click', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        resultDiv.textContent = 'Необходимо войти в систему!';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/protected', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        resultDiv.textContent = data.message;
    } catch (error) {
        resultDiv.textContent = 'Ошибка при получении данных: ' + error;
    }
});