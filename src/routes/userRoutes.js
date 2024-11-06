const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Rotas públicas
router.post('/login', userController.login);
router.post('/register', userController.register);

// Rotas protegidas
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        await User.update(req.params.id, req.body);
        res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await User.delete(req.params.id);
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:id/reset-password', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        
        const hashedPassword = await bcrypt.hash('12345', 10);
        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.params.id]
        );
        
        res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:id/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.params.id;

        // Verificar se o usuário está alterando sua própria senha
        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ message: 'Não autorizado' });
        }

        // Buscar usuário
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar senha atual
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Senha atual incorreta' });
        }

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Atualizar senha
        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );

        res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 