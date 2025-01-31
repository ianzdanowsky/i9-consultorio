'use server';

import { fetchFromWhisper } from "~/lib/whisper/whisper";
import { fetchFromOllama } from "~/lib/ollama/ollama";

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