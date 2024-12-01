import { useState, useCallback, useRef } from "react";

export function useAudioRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    setIsRecording(true);
    console.log("Started recording");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    // Push audio data chunks as they are available
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.start(); // Start recording
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise<string>((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          const audioURL = URL.createObjectURL(audioBlob);
          console.log("Stopped recording:", audioURL);
          resolve(audioURL);
        };

        mediaRecorderRef.current.stop(); // Stop recording
        setIsRecording(false);
      } else {
        resolve(""); // Resolve with an empty string if no recording exists
      }
    });
  }, []);


  return { isRecording, startRecording, stopRecording };
}