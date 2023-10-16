const path = require('path')
const mysql = require('mysql2')
const migration = require('mysql-migrations')
require('dotenv').config()

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: Number(process.env.MYSQL_POOL_CONNECTION_LIMIT)
})

migration.init(connection, path.join(__dirname, 'migrations'), () => {
  console.log('Finished running migrations')
})
