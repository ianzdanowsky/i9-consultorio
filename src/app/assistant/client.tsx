"use client";

import { useState } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useAudioRecording } from "~/hooks/useAudioRecording";
import { transcribeAudio, generateText } from "./actions";

export default function AudioTranslationChat() {
  const [recordings, setRecordings] = useState<{audioUrls: string[], audioBlobs: Blob[]}>({audioUrls: [], audioBlobs: []});
  const { isRecording, startRecording, stopRecording } = useAudioRecording();
  const [transcription, setTranscription] = useState<string | null>(null);
  const [generatedAiText, setGeneratedAiText] = useState<string | null>(null);

  const handleMicClick = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      const newRecording = await stopRecording();
      setRecordings({audioUrls: [...recordings.audioUrls, newRecording.audioURL], audioBlobs: [...recordings.audioBlobs, newRecording.audioBlob]});
      const transcribedAudio = await transcribeAudio(newRecording.wavBlob);
      // const generatedText = await generateText(transcribedAudio);
      // setGeneratedAiText(generatedText);
      setTranscription(transcribedAudio);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="mx-auto flex h-full max-w-2xl flex-col rounded-lg bg-white shadow-md">
          <div className="flex-1 overflow-auto p-4">
            {transcription ? (
              <p>{transcription}</p>
            ) : (
              <p className="text-gray-500">No transcription available</p>
            )}
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {generatedAiText ? (
              <p>{generatedAiText}</p>
            ) : (
              <p className="text-gray-500">No AI generated text available</p>
            )}
          </div>
          <div className="border-t p-4">
            <div className="flex items-center">
              <Button
                onClick={handleMicClick}
                className={`rounded-full p-3 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {isRecording ? (
                  <Send className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
              <p className="ml-4 text-sm text-gray-500">
                {isRecording
                  ? "Listening... Click to stop"
                  : "Click the microphone to start"}
              </p>
            </div>
          </div>
        </div>
      </main>
      <aside className="w-80 border-l bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Translation History</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {recordings.audioUrls.map((recording) => (
            <div key={recording}>
              <h2>Playback</h2>
              <audio controls>
                <source src={recording} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </ScrollArea>
      </aside>
    </div>
  );
}
