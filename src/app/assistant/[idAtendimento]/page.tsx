import AudioTranslationChat from "./client";
import { connectDB } from "~/lib/db"
import { PacientHistory } from "./interfaces";

export default async function AssistantPage({params}:{params: {"idAtendimento": string}}) {

    const idAtendimento = await params.idAtendimento

    const pool = await connectDB()
    const historyPatients = await pool.request().query(`SELECT MATENDIMENTO.ID AS ID, FORMAT(MATENDIMENTO.DATAHORAEXECUTA, 'dd-MM-yyyy HH:mm:ss') AS DATA, CPACIENTE.ID AS PACIENTEID, CPACIENTE.NOME + ' - ' + DBO.FN_IDADE(CPACIENTE.NASCIMENTO, GETDATE()) AS NAME, CPACIENTE.CNS AS CNS, CPACIENTE.EMAIL, MATENDIMENTO.ATENDIMENTO, MATENDIMENTO.ETAPAID FROM MATENDIMENTO INNER JOIN CPACIENTE ON CPACIENTE.ID = PACIENTEID WHERE CPACIENTE.ID = (SELECT TOP 1 PACIENTEID FROM MATENDIMENTO WHERE MATENDIMENTO.ID = ${idAtendimento}) ORDER BY DATAHORAEXECUTA DESC;`)
    const historyPatientsRecordset: PacientHistory[] = historyPatients.recordset
    return (
        <div className="flex h-screen bg-gray-100">
        <main className="flex-1 p-6">
            <AudioTranslationChat pacientHistory={historyPatientsRecordset} idAtendimento={idAtendimento} />
        </main>
        </div>
    );
    }
