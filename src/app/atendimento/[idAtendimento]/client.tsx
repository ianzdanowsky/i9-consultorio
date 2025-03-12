"use client";

import { useState } from "react";
import {
  Mic,
  Send,
  ChevronDown,
  ChevronUp,
  Edit,
  Save,
  Square,
  RotateCcw,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useAudioRecording } from "~/hooks/useAudioRecording";
import { transcribeAudio } from "./actions";
import { useRouter } from "next/navigation";
import { type PacientHistory } from "./interfaces";
import {
  writeProntuarioToDatabase,
  updateAtendimentoDatabase,
} from "./actions";
import { useToast } from "~/hooks/use-toast";
import Lottie from "lottie-react";
import transcribingAnimation from "~/components/animations/lottie/transcribing.json";
import { type Session } from "next-auth";
import UserProfileButton from "~/components/UserProfileButton";
import TextareaAutosize from "react-textarea-autosize";

export default function AudioTranslationChat({
  pacientHistory,
  idAtendimento,
  session,
}: {
  pacientHistory: PacientHistory[];
  idAtendimento: string;
  session: Session | null;
}) {
  const [recordings, setRecordings] = useState<{
    audioUrls: string[];
    audioBlobs: Blob[];
  }>({ audioUrls: [], audioBlobs: [] });
  const [transcription, setTranscription] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>("");
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const { isRecording, startRecording, stopRecording } = useAudioRecording();

  const { toast } = useToast();

  const router = useRouter();

  // const session = useSession();

  // Get the user session data for database operations
  const professionalId = session?.user.id ?? "";

  // Get the pacient data for database operations
  const atendimentoId = idAtendimento;
  const pacientId = pacientHistory[0]?.PACIENTEID ?? "Não identificado";
  const pacientName = pacientHistory[0]?.NAME ?? "Não identificado";
  // const pacientCns = pacientHistory[0]?.CNS ?? "Não identificado"
  const pacientEtapaId = pacientHistory[0]?.ETAPAID ?? "Não identificado";

  const handleMicClickAppend = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      console.log("Appending transcription...");
      const newRecording = await stopRecording();
      setRecordings({
        audioUrls: [...recordings.audioUrls, newRecording.audioURL],
        audioBlobs: [...recordings.audioBlobs, newRecording.audioBlob],
      });
      setIsTranscribing(true);
      const transcribedAudio = await transcribeAudio(newRecording.wavBlob);
      setTranscription(transcription + "\n" + transcribedAudio);
      setIsTranscribing(false);
      setEditedText(transcription + "\n" + transcribedAudio);
    }
  };

  const handleMicClick = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      const newRecording = await stopRecording();
      setRecordings({
        audioUrls: [...recordings.audioUrls, newRecording.audioURL],
        audioBlobs: [...recordings.audioBlobs, newRecording.audioBlob],
      });
      setIsTranscribing(true);
      const transcribedAudio = await transcribeAudio(newRecording.wavBlob);
      setTranscription(transcribedAudio);
      setIsTranscribing(false);
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
      writeProntuarioToDatabase(
        atendimentoId,
        pacientId,
        pacientName,
        transcription,
        pacientEtapaId,
        professionalId,
      )
        .then(() => {
          console.log("Prontuário escrito com sucesso!");
        })
        .catch((error) => {
          console.error(error);
        });
      // Atualizar atendimetno
      const nowDatetime = new Date().toISOString();
      updateAtendimentoDatabase(
        atendimentoId,
        nowDatetime,
        professionalId,
        transcription,
      )
        .then(() => {
          console.log("Atendimento atualizado com sucesso!");
        })
        .catch((error) => {
          console.error(error);
        });
      //
    } catch (error) {
      console.log(error);
    } finally {
      setTranscription("");
      setRecordings({ audioUrls: [], audioBlobs: [] });
      toast({
        title: "Atendimento finalizado",
        description: "O atendimento foi finalizado com sucesso.",
        duration: 5000,
        color: "green",
      });
      setTimeout(() => router.push("/pesquisa"), 2000);
    }
  };

  const handleResetClick = () => {
    setTranscription("");
    setRecordings({ audioUrls: [], audioBlobs: [] });
  };

  const currentPatient = {
    name: pacientName,
    cns: pacientHistory[0]?.CNS ?? "Não identificado",
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <main className="mx-auto flex min-h-screen w-full max-w-lg flex-1 flex-grow flex-col overflow-hidden rounded-lg bg-white p-4 shadow-md">
        <div className="mb-4 flex flex-col items-center space-y-3">
          <Button
            onClick={() => router.push("/pesquisa")}
            className="flex w-full items-center justify-center rounded-lg border px-6 py-3"
          >
            Voltar
          </Button>
          <UserProfileButton session={session} />
        </div>

        {/* Header - Patient Information */}
        <div className="mb-4 rounded-lg border border-gray-300 bg-gray-100 p-3 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Paciente: {currentPatient.name}
          </h2>
          <p className="text-sm text-gray-700">{currentPatient.cns}</p>
        </div>

        {/* Transcription Section */}
        <div className="flex-1 overflow-y-auto border-b pb-4">
          <h2 className="mb-2 text-lg font-semibold">
            Transcrição do atendimento
          </h2>

          {isTranscribing ? (
            <div className="flex flex-col items-center justify-center">
              <p className="ml-2">
                Aguarde enquanto a transcrição está sendo processada pela IA...
              </p>
              <Lottie
                animationData={transcribingAnimation}
                loop={true}
                style={{ height: 200 }}
              />
            </div>
          ) : (
            <>
              {editing ? (
                <div className="relative w-full">
                  <TextareaAutosize
                    className="max-h-[300px] w-full resize-none overflow-y-auto rounded-md border p-2"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    minRows={3} // Minimum 3 rows to avoid too small textarea
                    maxRows={10} // Limit max rows to avoid excessive size
                  />
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto rounded-md border bg-gray-50 p-2">
                  <p className="whitespace-pre-line text-gray-700">
                    {transcription ||
                      "Nenhuma transcrição disponível. Clique no microfone para iniciar."}
                  </p>
                </div>
              )}

              {transcription && (
                <Button
                  onClick={editing ? handleSaveClick : handleEditClick}
                  className="mt-2 flex items-center gap-2 text-white"
                >
                  {editing ? (
                    <Save className="h-5 w-5" />
                  ) : (
                    <Edit className="h-5 w-5" />
                  )}
                  {editing ? "Salvar edição" : "Editar"}
                </Button>
              )}

              {transcription && (
                <Button
                  onClick={handleMicClickAppend}
                  className="mt-2 flex items-center gap-2 text-white"
                >
                  <Mic className="h-5 w-5" />
                  {isRecording ? "Interromper" : "Adicionar transcrição"}
                </Button>
              )}
            </>
          )}
        </div>

        {/* Microphone Button */}
        <div className="mt-4 flex flex-col items-center space-y-3">
          {transcription && !isTranscribing && (
            <>
              {/* Save Button */}
              <Button
                onClick={handleFinishClick}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-white"
              >
                <Send className="h-5 w-5" />
                Salvar atendimento
              </Button>

              {/* Reset Button (White Background) */}
              <Button
                onClick={handleResetClick}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-900 hover:bg-gray-100"
              >
                <RotateCcw className="h-5 w-5" />
                Reiniciar atendimento
              </Button>
            </>
          )}
        </div>
        {!isTranscribing && !transcription && (
          <div className="mt-4 flex flex-col items-center justify-center space-y-2">
            <Button
              onClick={handleMicClick}
              className={`transform rounded-full p-7 transition-transform hover:scale-110 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isRecording ? (
                <Square className="h-50 w-50" /> // Stop icon with increased size
              ) : (
                <Mic className="h-10 w-10" /> // Mic icon with increased size
              )}
            </Button>
            <p className="text-sm text-gray-500">
              {isRecording
                ? "Escutando... clique para interromper."
                : "Iniciar atendimento por voz"}
            </p>
          </div>
        )}
        {/* History Dropdown */}
        <div className="border-b py-4">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="flex w-full items-center justify-between rounded-md bg-gray-200 px-4 py-2 text-gray-700"
          >
            <span className="text-sm font-medium">
              Histórico de atendimentos
            </span>
            {historyOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {historyOpen && (
            <ScrollArea className="mt-4 h-48 rounded-lg border bg-gray-50 p-2">
              {pacientHistory.map((history) => (
                <div
                  key={history.ID}
                  className="mb-2 rounded-md bg-white p-2 shadow-sm"
                >
                  <h3 className="text-md font-semibold">{history.NAME}</h3>
                  <p className="text-sm text-gray-900">{history.DATA}</p>
                  <p className="text-sm text-gray-600">{history.ATENDIMENTO}</p>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      </main>
    </div>
  );
}
