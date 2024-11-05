const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ti_labscheduler',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testar conexão
pool.getConnection()
    .then(connection => {
        console.log('Banco de dados conectado com sucesso!');
        connection.release();
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

module.exports = pool;
