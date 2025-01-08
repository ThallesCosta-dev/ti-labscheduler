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
        rejectUnauthorized: false,
        enableTrace: true
    },
    connectTimeout: 60000
});

// Log detalhado da tentativa de conexão
pool.getConnection()
    .then(connection => {
        console.log('Conexão bem sucedida!');
        console.log('Conectado como:', process.env.DB_USER);
        console.log('Banco de dados:', process.env.DB_NAME);
        connection.release();
    })
    .catch(err => {
        console.error('Detalhes do erro de conexão:', {
            message: err.message,
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            host: process.env.DB_HOST,
            user: process.env.DB_USER
        });
    });

module.exports = pool;
