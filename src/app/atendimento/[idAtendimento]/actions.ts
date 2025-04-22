'use server';

import { fetchFromWhisper } from "~/lib/whisper/whisper";
import { fetchFromOllama } from "~/lib/ollama/ollama";
import { connectDB } from "~/lib/db/db";
import { type ConnectionPool } from "mssql";

type Result = {
    text: string
    transcribe_time?: number
}

export async function transcribeAudio(blob: Promise<Blob>): Promise<string> {
    const response = await fetchFromWhisper(await blob);
    const jsonResponse = await response.json() as Result; // Parse the response as JSON
    const text = jsonResponse.text; // Access the 'text' field
    console.log(text); // Log only the transcribed text
    return text
}

export async function generateText(prompt: string): Promise<string> {
    const response = await fetchFromOllama(prompt);
    const jsonResponse = await response.json() as Result; // Parse the response as JSON
    const text = jsonResponse.text; // Access the 'text' field
    console.log(text); // Log only the generated code
    return text
}

export async function writeProntuarioToDatabase(ATENDIMENTOID: string, PACIENTEID: string, PACIENTENOME: string, CONTEUDO: string, ETAPAID: string, PROFISSIONALID: string) {
    const DATAATUAL = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `INSERT INTO [mprontuario] 
    ([dataref], [atendimentoid], [pacienteid], [pacientenome], [conteudo], [etapaid], [profissionalcodigo]) 
    VALUES ('${DATAATUAL}', '${ATENDIMENTOID}', '${PACIENTEID}', '${PACIENTENOME}', '${CONTEUDO}', '${ETAPAID}', '${PROFISSIONALID}')`;

    const pool = await connectDB() as unknown as ConnectionPool
    const result = await pool.request().query(sqlQuery)
    console.log(result.rowsAffected)
}


export async function updateAtendimentoDatabase(ATENDIMENTOID: string, DATA: string, PROFISSIONALID: string, ATENDIMENTO: string) {
    const sqlQuery = `UPDATE [matendimento] 
    SET [datahoraexecuta] = '${DATA}', 
        [profissionalid] = '${PROFISSIONALID}', 
        [atendimento] = '${ATENDIMENTO}', 
        [diagnosticos] = '', 
        [procedimentos] = '',
        [situacao] = 2

    WHERE matendimento.id = '${ATENDIMENTOID}'`;
    const pool = await connectDB() as unknown as ConnectionPool
    const result = await pool.request().query(sqlQuery)
    console.log(result.rowsAffected)
}