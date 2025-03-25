const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const secretKey = 'secretnyklusch123';
let users = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Имя пользователя и пароль обязательны.' });
    }

    // Проверка существования пользователя (в реальном приложении проверяйте в БД)
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует.' });
    }

    const newUser = { username, password }; 
    users.push(newUser);
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован.' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль.' });
    }

    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Запрещено
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Не авторизован
    }
};

app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Привет, ${req.user.username}! Это защищенные данные.` });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});