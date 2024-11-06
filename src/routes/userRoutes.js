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
        const [rows] = await pool.execute(
            'SELECT id, name, email, matricula, birth_date, phone, role FROM users WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const user = rows[0];
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            matricula: user.matricula,
            birth_date: user.birth_date,
            phone: user.phone,
            role: user.role
        });
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

        // Buscar usuário com senha
        const [users] = await pool.execute(
            'SELECT id, password FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const user = users[0];

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
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 