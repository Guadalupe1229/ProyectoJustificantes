const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  uri: process.env.DB_URL || 'mysql://root:tu_contraseña@shortline.proxy.rlwy.net:26695/railway',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
