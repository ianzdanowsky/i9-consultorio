"use server"

import { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "~/lib/db"

export default async function getPacients(search_string: string) {
    
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

    return Atendimentos

  }