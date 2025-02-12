"use client";

import { useState } from "react";
import { Mic, Send, ChevronDown, ChevronUp, Edit, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useAudioRecording } from "~/hooks/useAudioRecording";
import { transcribeAudio } from "./actions";
// import { getSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";
import { PacientHistory } from "./interfaces";
import { writeProntuarioToDatabase, updateAtendimentoDatabase } from "./actions";
import { useToast } from "~/hooks/use-toast"
import {Spinner} from "@heroui/spinner";
import LogoutButton from "~/components/LogoutButton";

export default function AudioTranslationChat({ pacientHistory, idAtendimento }: { pacientHistory: PacientHistory[], idAtendimento: string }) {
  const [recordings, setRecordings] = useState<{ audioUrls: string[], audioBlobs: Blob[] }>({ audioUrls: [], audioBlobs: [] });
  const [transcription, setTranscription] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>("");
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  
  const { isRecording, startRecording, stopRecording } = useAudioRecording();

  const { toast } = useToast()

  const router = useRouter()

  const session = useSession()

  // Get the user session data for database operations
  const professionalId = session.data?.user.id ?? ""

  // Get the pacient data for database operations
  const atendimentoId = idAtendimento
  const pacientId = pacientHistory[0]?.PACIENTEID ?? "Não identificado"
  const pacientName = pacientHistory[0]?.NAME ?? "Não identificado"
  const pacientCns = pacientHistory[0]?.CNS ?? "Não identificado"
  const pacientEtapaId = pacientHistory[0]?.ETAPAID ?? "Não identificado"


  // Uncomment to troubleshoot session in the browser
  // getSession().then(session => console.log(session)).catch(err => console.error(err));

  const handleMicClick = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      const newRecording = await stopRecording();
      setRecordings({
        audioUrls: [...recordings.audioUrls, newRecording.audioURL],
        audioBlobs: [...recordings.audioBlobs, newRecording.audioBlob]
      });
      setIsTranscribing(true)
      const transcribedAudio = await transcribeAudio(newRecording.wavBlob);
      setTranscription(transcribedAudio);
      setIsTranscribing(false)
      setEditedText(transcribedAudio);
    }
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    setEditing(false);
    setTranscription(editedText);
  };

  const handleFinishClick = () => {
    try {
    // Escrever prontuario
    writeProntuarioToDatabase(atendimentoId, pacientId, pacientName, transcription, pacientEtapaId)
    // Atualizar atendimetno
    const nowDatetime = new Date().toISOString()
    updateAtendimentoDatabase(atendimentoId, nowDatetime, professionalId, transcription)
    //
    } catch (error) {
      console.log(error)
    } finally {
      setTranscription("")
      setRecordings({ audioUrls: [], audioBlobs: [] })
      toast({
        title: "Atendimento finalizado",
        description: "O atendimento foi finalizado com sucesso.",
        duration: 5000,
        color: "green",
      })
      setTimeout(() => router.push("/pesquisa"), 2000)
    }
  }

  const currentPatient = {
    name: pacientName,
    cns: pacientHistory[0]?.CNS ?? "Não identificado",
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <main className="flex flex-col flex-1 max-w-lg mx-auto bg-white shadow-md rounded-lg p-4 w-full">
      
      <div className="flex justify-center mb-4">
          <Button onClick={() => router.push("/pesquisa")} className="flex items-center space-x-2 mr-4" variant="default">
            Voltar
            </Button>
          <LogoutButton />
        </div>


        {/* Header - Patient Information */}
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-blue-900">Paciente: {currentPatient.name}</h2>
          <p className="text-sm text-blue-700">{currentPatient.cns}</p>
        </div>

{/* Transcription Section */}
<div className="flex-1 overflow-auto border-b pb-4">
  <h2 className="text-lg font-semibold mb-2">Transcrição do atendimento</h2>
  {isTranscribing ? (
    <div className="flex items-center justify-center">
    <Spinner color="success" />
    <p className="ml-2">Aguarde enquanto a transcrição está sendo processada pela IA...</p>
  </div>
  ) : (
    <>
      {editing ? (
        <textarea
          className="w-full p-2 border rounded-md"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      ) : (
        <p className="text-gray-700">{transcription || "Nenhuma transcrição disponível. Clique no microfone para iniciar."}</p>
      )}
      {transcription && (
        <Button
          onClick={editing ? handleSaveClick : handleEditClick}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          {editing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          {editing ? "Salvar" : "Editar"}
        </Button>
      )}
    </>
  )}
</div>


        {/* Microphone Button */}
        <div className="flex justify-center items-center mt-4">
          {transcription && !isTranscribing && (
            <Button onClick={() => handleFinishClick()} className="mr-4 bg-blue-500 hover:bg-blue-600 text-white">
              <Send className="h-5 w-5" />
              Salvar atendimento
            </Button>
            )}
            </div>
        <div className="flex justify-center items-center mt-4">
          <Button
            onClick={handleMicClick}
            className={`rounded-full p-3 ${
              isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isRecording ? <Send className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>
          <p className="ml-4 text-sm text-gray-500">
            {isRecording ? "Escutando... clique para interromper." : "Iniciar atendimento por voz"}
          </p>
        </div>

        {/* History Dropdown */}
        <div className="py-4 border-b">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="flex items-center justify-between w-full bg-gray-200 px-4 py-2 rounded-md text-gray-700"
          >
            <span className="text-sm font-medium">Histórico de atendimentos</span>
            {historyOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {historyOpen && (
            <ScrollArea className="mt-4 h-48 border rounded-lg p-2 bg-gray-50">
              {pacientHistory.map((history) => (
                <div key={history.ID} className="p-2 bg-white rounded-md shadow-sm mb-2">
                  <h3 className="text-md font-semibold">{history.NAME}</h3>
                  <p className="text-gray-900 text-sm">{history.DATA}</p>
                  <p className="text-gray-600 text-sm">{history.ATENDIMENTO}</p>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      </main>
    </div>
  );
}
