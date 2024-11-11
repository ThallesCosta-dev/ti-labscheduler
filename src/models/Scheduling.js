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

        // Verificar disponibilidade para cada computador
        const computadores = computerNumber.split(',');
        for (const comp of computadores) {
            const [existing] = await pool.execute(
                `SELECT * FROM schedulings 
                WHERE laboratory = ? 
                AND computer_number LIKE ? 
                AND date = ? 
                AND ((time_start <= ? AND time_end > ?) 
                OR (time_start < ? AND time_end >= ?))`,
                [laboratory, `%${comp}%`, date, timeEnd, timeStart, timeEnd, timeStart]
            );

            if (existing.length > 0) {
                throw new Error(`Computador ${comp} já está agendado para este horário`);
            }
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
            `SELECT s.*, u.name as user_name,
            (SELECT COUNT(*) FROM schedulings 
             WHERE computer_number = s.computer_number 
             AND date = s.date 
             AND time_start = s.time_start) as computer_count
            FROM schedulings s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.user_id = ?
            ORDER BY s.date DESC, s.time_start ASC`,
            [userId]
        );
        return schedulings;
    }

    static async getAll() {
        const [schedulings] = await pool.execute(
            `SELECT s.*, u.name as user_name,
            (SELECT COUNT(*) FROM schedulings 
             WHERE computer_number = s.computer_number 
             AND date = s.date 
             AND time_start = s.time_start) as computer_count
            FROM schedulings s 
            JOIN users u ON s.user_id = u.id 
            ORDER BY s.date DESC, s.time_start ASC`
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

    static async getCurrentSchedulings() {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().slice(0, 5);

        const [rows] = await pool.execute(
            `SELECT s.*, u.name as user_name 
             FROM schedulings s 
             JOIN users u ON s.user_id = u.id 
             WHERE s.date = ? 
             AND s.time_start <= ? 
             AND s.time_end > ?
             ORDER BY s.time_start ASC`,
            [currentDate, currentTime, currentTime]
        );
        
        return rows;
    }

    static async getComputersInUse(laboratory, date, timeStart, timeEnd) {
        const [rows] = await pool.execute(
            `SELECT computer_number 
             FROM schedulings 
             WHERE laboratory = ? 
             AND date = ? 
             AND ((time_start <= ? AND time_end > ?) 
             OR (time_start < ? AND time_end >= ?))`,
            [laboratory, date, timeEnd, timeStart, timeEnd, timeStart]
        );

        // Transformar a string de computadores em um array de números
        const computersInUse = new Set();
        rows.forEach(row => {
            const computers = row.computer_number.split(',');
            computers.forEach(comp => computersInUse.add(comp.trim()));
        });

        return Array.from(computersInUse);
    }
}

module.exports = Scheduling; 