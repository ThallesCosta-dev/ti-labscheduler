const pool = require('../config/database');

const schedulingController = {
    async create(req, res) {
        try {
            const { 
                laboratory, 
                computerNumber, 
                date, 
                timeStart, 
                timeEnd,
                supervisor,
                responsible,
                studentCount,
                requiredPrograms 
            } = req.body;
            
            const userId = req.user.id;

            // Verificar sobreposição de horários
            const [existingSchedulings] = await pool.execute(
                `SELECT * FROM schedulings 
                WHERE laboratory = ? 
                AND computer_number = ? 
                AND date = ? 
                AND ((time_start <= ? AND time_end > ?) 
                OR (time_start < ? AND time_end >= ?))`,
                [laboratory, computerNumber, date, timeEnd, timeStart, timeEnd, timeStart]
            );

            if (existingSchedulings.length > 0) {
                return res.status(400).json({ message: 'Horário já agendado' });
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

            res.status(201).json({ message: 'Agendamento criado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const [schedulings] = await pool.execute(
                'SELECT s.*, u.name as user_name FROM schedulings s JOIN users u ON s.user_id = u.id'
            );
            res.json(schedulings);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = schedulingController; 