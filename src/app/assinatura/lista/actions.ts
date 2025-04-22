"use server"

import sql from "mssql"

const sqlConfig = {
  user: process.env.DB_USER ?? "sa",
  password: process.env.DB_PASSWORD ?? "security",
  database: process.env.DB_NAME ?? "2020_MS",
  server: process.env.DB_SERVER ?? "192.168.88.5",
  port: parseInt(process.env.DB_SERVER_PORT ?? "1433"),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
      instanceName: process.env.DB_INSTANCE,   // Specify the named instance here
      encrypt: false,          // Disable encryption if not needed
      trustServerCertificate: true,  // Bypass SSL certificate errors
  },
}

export async function saveSignature(data: string, referenceId: number, type: "signature" | "photo") {
  try {
    await sql.connect(sqlConfig)

    const result = await sql.query`
      INSERT INTO Signatures (reference_id, data, type, created_at)
      VALUES (${referenceId}, ${data}, ${type}, ${new Date().toISOString()})
    `
    if (result.rowsAffected.length === 0) {
      throw new Error("Failed to save signature")
    }
    
    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
}
}

export async function getSignatures() {
  try {
    await sql.connect(sqlConfig)

    const result = await sql.query`
      SELECT 
        id, 
        reference_id,
        type, 
        created_at,
        CASE 
          WHEN LEN(data) > 100 THEN SUBSTRING(data, 1, 100) + '...' 
          ELSE data 
        END as data_preview,
        data
      FROM Signatures
      ORDER BY created_at DESC
    `

    return {
      success: true,
      signatures: result.recordset,
    }
  } catch (error) {
    console.error("Database error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
      signatures: [],
    }
}
}

