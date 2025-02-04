import sql from "mssql"

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // Usado para Azure, pode ser false para servidores locais
    trustServerCertificate: false,
  },
}

export async function connectDB() {
  try {
    const pool = await sql.connect(config)
    return pool
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err)
    throw err
  }
}
