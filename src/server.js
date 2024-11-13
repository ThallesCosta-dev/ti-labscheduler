const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const schedulingRoutes = require('./routes/schedulingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Verificação de conexão com banco de dados
const pool = require('./config/database');
pool.getConnection()
    .then(connection => {
        console.log('Banco de dados conectado com sucesso!');
        connection.release();
    })
    .catch(error => {
        console.error('Erro ao conectar ao banco de dados:', error);
    });

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/schedulings', schedulingRoutes);

// Rota para servir arquivos estáticos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Rota para outros arquivos estáticos
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error('Erro:', err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Erro ao iniciar servidor:', err);
}); 