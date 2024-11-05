const pool = require('../config/database');
const Scheduling = require('../models/Scheduling');

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

            // Validar entrada
            if (!computerNumber || computerNumber.split(',').length === 0) {
                return res.status(400).json({ message: 'Selecione pelo menos um computador' });
            }

            const schedulingId = await Scheduling.create({
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
            });

            res.status(201).json({ 
                message: 'Agendamento criado com sucesso',
                schedulingId 
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = schedulingController; 