export function fetchFromWhisper(blob: Blob): Promise<Response> {
    const form = new FormData();
    form.append('timestamp', new Date().toISOString());
    form.append('audio', blob);
    const result = fetch('http://127.0.0.1:9090/audioToText', {
        method: 'POST',
        body: form
    });
    return result;
}
