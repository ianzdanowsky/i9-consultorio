"use server"

import { type ConnectionPool } from "mssql";
import { connectDB } from "~/lib/db"
import { type paciente } from "~/interfaces/pacientes";


export default async function getPacients(barcode_search_string: string) {
  try {
    const pool = await connectDB() as unknown as ConnectionPool;
    let query = `
      SELECT MATENDIMENTO.ID AS ID, 
             CPACIENTE.NOME + ' - ' + DBO.FN_IDADE(CPACIENTE.NASCIMENTO, GETDATE()) AS NAME, 
             CPACIENTE.CNS AS EMAIL 
      FROM MATENDIMENTO 
      INNER JOIN CPACIENTE ON CPACIENTE.ID = MATENDIMENTO.PACIENTEID 
      WHERE SITUACAO = 1
    `;

    const request = pool.request();

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

    const pacientes = result.recordset.map((row: paciente) => ({
      ID: row.ID,
      NAME: row.NAME,
      EMAIL: row.EMAIL,
    }));

    console.log(pacientes)

    return pacientes;
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
}
