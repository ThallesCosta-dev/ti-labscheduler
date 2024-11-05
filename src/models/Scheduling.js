const pool = require('../config/database');

class Scheduling {
    static async create(schedulingData) {
        const { userId, laboratory, computerNumber, date, time, duration } = schedulingData;

        // Verificar disponibilidade
        const [existing] = await pool.execute(
            `SELECT * FROM schedulings 
            WHERE laboratory = ? 
            AND computer_number = ? 
            AND date = ? 
            AND ((time <= ? AND ADDTIME(time, SEC_TO_TIME(duration * 3600)) > ?) 
            OR (time < ADDTIME(?, SEC_TO_TIME(? * 3600)) AND time >= ?))`,
            [laboratory, computerNumber, date, time, time, time, duration, time]
        );

        if (existing.length > 0) {
            throw new Error('Horário já agendado');
        }

        const [result] = await pool.execute(
            'INSERT INTO schedulings (user_id, laboratory, computer_number, date, time, duration) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, laboratory, computerNumber, date, time, duration]
        );

        return result.insertId;
    }

    static async getByUserId(userId) {
        const [schedulings] = await pool.execute(
            `SELECT s.*, u.name as user_name 
            FROM schedulings s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.user_id = ?
            ORDER BY s.date, s.time`,
            [userId]
        );
        return schedulings;
    }

    static async getAll() {
        const [schedulings] = await pool.execute(
            `SELECT s.*, u.name as user_name 
            FROM schedulings s 
            JOIN users u ON s.user_id = u.id 
            ORDER BY s.date, s.time`
        );
        return schedulings;
    }

    static async delete(id, userId) {
        const [result] = await pool.execute(
            'DELETE FROM schedulings WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Scheduling; 