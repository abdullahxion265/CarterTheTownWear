const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'carterthetown',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

promisePool
  .getConnection()
  .then((conn) => {
    console.log('[DB] MySQL connected — carterthetown');
    conn.release();
  })
  .catch((err) => {
    console.error('[DB] Connection failed:', err.message);
    console.error('Make sure XAMPP MySQL is running and run setup.sql first.');
  });

module.exports = promisePool;
