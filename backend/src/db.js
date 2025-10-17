const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// Crear pool usando la URL completa de Railway
const pool = mysql.createPool(process.env.DB_URL);

console.log('DEBUG typeof pool:', typeof pool); // debe mostrar "object"

module.exports = pool;
