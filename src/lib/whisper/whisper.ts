export function fetchFromWhisper(blob: Blob): Promise<Response> {
    const form = new FormData();
    form.append('timestamp', new Date().toISOString());
    form.append('audio', blob);
    const whisperUrl = process.env.WHISPER_URL
    const whisperUrlAudioToText = whisperUrl + '/audioToText'
    const result = fetch(whisperUrlAudioToText, {
        method: 'POST',
        body: form
    });
    return result;
}
