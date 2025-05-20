const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root', 
    password: '160456@Md',
    database: 'projetogymtri',
    port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if(err) 
        console.log(err)
    else
        console.log("Conectado ao SGBD!")
})

module.exports = pool
