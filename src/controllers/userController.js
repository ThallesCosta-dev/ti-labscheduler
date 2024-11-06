const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userController = {
    async register(req, res) {
        try {
            console.log('Dados recebidos:', req.body);
            const { name, email, password, matricula, birthDate, phone, type } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const [result] = await pool.execute(
                'INSERT INTO users (name, email, password, matricula, birth_date, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, email, hashedPassword, matricula, birthDate, phone, type]
            );
            
            console.log('Usuário criado com sucesso:', result);
            res.status(201).json({ message: 'Usuário registrado com sucesso' });
        } catch (error) {
            console.error('Erro no registro:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }
            res.status(500).json({ message: error.message });
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
                { id: user.id, role: user.role },
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
