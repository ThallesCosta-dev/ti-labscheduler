const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Rotas públicas
router.post('/login', userController.login);
router.post('/register', userController.register);

// Rotas protegidas
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 