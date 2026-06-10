const mysql = require('mysql2');
const dotenv = require('dotenv');
//const path = require('path');

// Load .env dari folder backend
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug: cek apakah env terbaca (hapus setelah deploy)
console.log('📋 Database Configuration:');
console.log('   Host:', process.env.DB_HOST || 'Not set');
console.log('   User:', process.env.DB_USER || 'Not set');
console.log('   Database:', process.env.DB_NAME || 'Not set');
console.log('   Port:', process.env.PORT || '8080');

// Buat connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export promise version untuk async/await
module.exports = pool.promise();