export function fetchFromOllama(prompt: string): Promise<Response> {
    const body = {
        model: "llama2",
        prompt: prompt,
        stream: false
    };

    return fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
}