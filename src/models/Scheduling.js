const pool = require('../config/database');

class Scheduling {
    static async create(schedulingData) {
        const { 
            userId, 
            laboratory, 
            computerNumber, 
            date, 
            timeStart, 
            timeEnd, 
            supervisor,
            responsible,
            studentCount,
            requiredPrograms 
        } = schedulingData;

        // Verificar disponibilidade
        const [existing] = await pool.execute(
            `SELECT * FROM schedulings 
            WHERE laboratory = ? 
            AND computer_number = ? 
            AND date = ? 
            AND ((time_start <= ? AND time_end > ?) 
            OR (time_start < ? AND time_end >= ?))`,
            [laboratory, computerNumber, date, timeEnd, timeStart, timeEnd, timeStart]
        );

        if (existing.length > 0) {
            throw new Error('Horário já agendado');
        }

        const [result] = await pool.execute(
            `INSERT INTO schedulings (
                user_id, 
                laboratory, 
                computer_number, 
                date, 
                time_start,
                time_end,
                supervisor,
                responsible,
                student_count,
                required_programs
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, 
                laboratory, 
                computerNumber, 
                date, 
                timeStart,
                timeEnd,
                supervisor,
                responsible,
                studentCount,
                requiredPrograms
            ]
        );

        return result.insertId;
    }

    static async getByUserId(userId) {
        const [schedulings] = await pool.execute(
            `SELECT s.*, u.name as user_name 
            FROM schedulings s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.user_id = ?
            ORDER BY s.date, s.time_start`,
            [userId]
        );
        return schedulings;
    }

    static async getAll() {
        const [schedulings] = await pool.execute(
            `SELECT s.*, u.name as user_name 
            FROM schedulings s 
            JOIN users u ON s.user_id = u.id 
            ORDER BY s.date, s.time_start`
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