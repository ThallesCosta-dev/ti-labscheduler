const express = require('express');
const router = express.Router();
const Scheduling = require('../models/Scheduling');
const auth = require('../middleware/auth');

// Criar agendamento
router.post('/', auth, async (req, res) => {
    try {
        const schedulingData = {
            ...req.body,
            userId: req.user.id
        };
        const schedulingId = await Scheduling.create(schedulingData);
        res.status(201).json({ 
            message: 'Agendamento criado com sucesso', 
            schedulingId 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Listar agendamentos (com verificação de role)
router.get('/my', auth, async (req, res) => {
    try {
        let schedulings;
        if (req.user.role === 'admin') {
            schedulings = await Scheduling.getAll();
        } else {
            schedulings = await Scheduling.getByUserId(req.user.id);
        }
        res.json(schedulings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Listar todos os agendamentos (admin)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        const schedulings = await Scheduling.getAll();
        res.json(schedulings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Deletar agendamento
router.delete('/:id', auth, async (req, res) => {
    try {
        const success = await Scheduling.delete(req.params.id, req.user.id);
        if (!success) {
            return res.status(404).json({ 
                message: 'Agendamento não encontrado ou não pertence ao usuário' 
            });
        }
        res.json({ message: 'Agendamento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para agendamentos em andamento
router.get('/current', auth, async (req, res) => {
    try {
        const currentSchedulings = await Scheduling.getCurrentSchedulings();
        res.json(currentSchedulings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para verificar computadores em uso
router.post('/computers-in-use', auth, async (req, res) => {
    try {
        const { laboratory, date, timeStart, timeEnd } = req.body;
        
        if (!laboratory || !date || !timeStart || !timeEnd) {
            return res.status(400).json({ 
                message: 'Todos os campos são obrigatórios' 
            });
        }

        const computersInUse = await Scheduling.getComputersInUse(
            laboratory, 
            date, 
            timeStart, 
            timeEnd
        );
        
        res.json(computersInUse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 