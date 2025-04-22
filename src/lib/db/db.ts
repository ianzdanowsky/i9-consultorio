import sql, { type config } from "mssql"

const dbconfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_SERVER_PORT ?? "1433"),
  database: process.env.DB_NAME,
  options: {
    instanceName: process.env.DB_INSTANCE,
    encrypt: false, // Usado para Azure, pode ser false para servidores locais
    trustServerCertificate: false,
  },
}

export async function connectDB() {
  try {
    const pool = await sql.connect(dbconfig as config)
    return pool
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err)
    throw err
  }
}
