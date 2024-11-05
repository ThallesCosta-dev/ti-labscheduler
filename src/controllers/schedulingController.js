const pool = require('../config/database');

const schedulingController = {
    async create(req, res) {
        try {
            const { laboratory, computerNumber, date, time, duration } = req.body;
            const userId = req.user.id; // Obtido do middleware de autenticação

            // Verificar sobreposição de horários
            const [existingSchedulings] = await pool.execute(
                `SELECT * FROM schedulings 
                WHERE laboratory = ? 
                AND computer_number = ? 
                AND date = ? 
                AND ((time <= ? AND ADDTIME(time, SEC_TO_TIME(duration * 3600)) > ?) 
                OR (time < ADDTIME(?, SEC_TO_TIME(? * 3600)) AND time >= ?))`,
                [laboratory, computerNumber, date, time, time, time, duration, time]
            );

            if (existingSchedulings.length > 0) {
                return res.status(400).json({ message: 'Horário já agendado' });
            }

            const [result] = await pool.execute(
                'INSERT INTO schedulings (user_id, laboratory, computer_number, date, time, duration) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, laboratory, computerNumber, date, time, duration]
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