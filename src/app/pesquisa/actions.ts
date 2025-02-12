"use server"

import { connectDB } from "~/lib/db"

export default async function getPacients(barcode_search_string: string) {
  try {
    const pool = await connectDB();
    let query = `
      SELECT MATENDIMENTO.ID AS ID, 
             CPACIENTE.NOME + ' - ' + DBO.FN_IDADE(CPACIENTE.NASCIMENTO, GETDATE()) AS NAME, 
             CPACIENTE.CNS AS EMAIL 
      FROM MATENDIMENTO 
      INNER JOIN CPACIENTE ON CPACIENTE.ID = MATENDIMENTO.PACIENTEID 
      WHERE SITUACAO = 1
    `;

    let request = pool.request();

    // Check if input is a number or string
    if (/^\d+$/.test(barcode_search_string)) {
      // If it's a number, search by ID
      query += ` AND MATENDIMENTO.ID = @ID`;
      request.input("ID", barcode_search_string);
    } else if (barcode_search_string.trim()) {
      // If it's a string, search by name
      query += ` AND CPACIENTE.NOME LIKE @NAME`;
      request.input("NAME", `%${barcode_search_string}%`); // Use LIKE for partial search
    }

    query += " ORDER BY DATAHORAAGENDA DESC";

    const result = await request.query(query);

    const pacientes = result.recordset.map((row: any) => ({
      id: row.ID,
      name: row.NAME,
      email: row.EMAIL,
    }));

    return pacientes;
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
}
