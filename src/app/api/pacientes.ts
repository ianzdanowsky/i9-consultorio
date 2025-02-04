import { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "~/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" })
  }

  try {
    const pool = await connectDB()
    const result = await pool.request().query("SELECT TOP 10 '123' AS id, 'TIAGO PORTELA' AS name,'TIAIOG@GMAIL.COM' AS  email,'' AS department, '' AS  role FROM MATENDIMENTO")

    const Atendimentos = result.recordset.map((row: any) => ({
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      metadata: {
        department: row.department,
        role: row.role,
      },
    }))

    res.status(200).json(Atendimentos)
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error)
    res.status(500).json({ error: "Erro ao buscar pacientes" })
  }
}
