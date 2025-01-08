const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false // necessário para conexões remotas na Hostinger
    }
});

// Testar conexão
pool.getConnection()
    .then(connection => {
        console.log('Banco de dados conectado com sucesso!');
        connection.release();
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    });

module.exports = pool;
