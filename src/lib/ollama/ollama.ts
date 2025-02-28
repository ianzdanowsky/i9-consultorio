export function fetchFromOllama(prompt: string): Promise<Response> {
    const finalPrompt = "A sua função é formatar textos transcritos de consultas oftamológicas. O texto a seguir foi transcrito de uma consulta oftamológica. Por favor, formate-o de acordo com as normas do prontuário eletrônico. Não retorne nenhuma introdução, apenas o texto formatado: " + prompt;
    const body = {
        model: "llama2",
        prompt: finalPrompt,
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