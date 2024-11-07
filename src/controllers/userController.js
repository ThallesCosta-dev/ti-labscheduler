const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userController = {
    async register(req, res) {
        try {
            const { name, email, password, matricula, birthDate, phone, type } = req.body;
            
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ 
                    success: false,
                    message: 'Este e-mail já está cadastrado. Por favor, use outro e-mail.' 
                });
            }

            const userId = await User.create({ 
                name, email, password, matricula, birthDate, phone, type 
            });

            if (userId) {
                return res.status(201).json({ 
                    success: true,
                    message: 'Usuário registrado com sucesso' 
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Falha ao criar usuário'
                });
            }
        } catch (error) {
            console.error('Erro no registro:', error);
            return res.status(500).json({ 
                success: false,
                message: error.message || 'Erro ao criar usuário. Tente novamente.' 
            });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios' });
            }

            const user = await User.findByEmail(email);
            
            if (!user) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            const token = jwt.sign(
                { 
                    id: user.id, 
                    role: user.role,
                    name: user.name
                },
                'sua_chave_secreta_aqui',
                { expiresIn: '24h' }
            );

            res.json({ 
                token, 
                role: user.role
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ message: 'Erro ao realizar login. Tente novamente.' });
        }
    }
};

module.exports = userController; 
