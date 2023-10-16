import mysql, { PoolConnection, RowDataPacket } from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0
})

const pooledConnection = async (action: any) => {
  const connection: PoolConnection = await new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      return err ? reject(err) : resolve(conn)
    })
  })

  try {
    return await action(connection)
  } finally {
    connection.release()
  }
}

export const querySQL = async (query: string, values = []) => {
  return pooledConnection(async (connection: RowDataPacket) => {
    const result = await new Promise((resolve, reject) => {
      connection.query(query, values, (error: Error, rows: []) => {
        return error ? reject(error) : resolve(rows)
      })
    })

    return JSON.parse(JSON.stringify(result))
  })
}

export const databaseHealth = async () => {
  try {
    await querySQL('SELECT now()')
  } catch (_err) {
    throw new Error('Cannot connect in MYSQL')
  }
}
