const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        const { name, email, password, matricula, birthDate, phone, type } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const [result] = await pool.execute(
                'INSERT INTO users (name, email, password, matricula, birth_date, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, email, hashedPassword, matricula, birthDate, phone, type]
            );
            return result.insertId;
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Email já cadastrado');
            }
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            console.log('Executando query para email:', email);
            const [users] = await pool.execute(
                'SELECT id, name, email, password, role FROM users WHERE email = ?',
                [email]
            );
            
            console.log('Resultado da query:', users);
            
            if (users.length === 0) {
                console.log('Nenhum usuário encontrado');
                return null;
            }
            
            const user = users[0];
            console.log('Usuário encontrado:', {
                id: user.id,
                email: user.email,
                role: user.role,
                hasPassword: !!user.password
            });
            
            return user;
        } catch (error) {
            console.error('Erro na consulta SQL:', error);
            throw new Error('Erro ao buscar usuário no banco de dados');
        }
    }

    static async findById(id) {
        const [users] = await pool.execute(
            'SELECT id, name, email, role FROM users WHERE id = ?',
            [id]
        );
        return users[0];
    }

    static async getAll() {
        const [users] = await pool.execute(
            'SELECT id, name, email, role, matricula, birth_date, phone FROM users'
        );
        return users;
    }

    static async update(id, userData) {
        const { name, email, type } = userData;
        await pool.execute(
            'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
            [name, email, type, id]
        );
    }

    static async delete(id) {
        await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    }
}

module.exports = User; 