import AudioTranslationChat from "./client";
export default function AssistantPage() {

    return (
        <div className="flex h-screen bg-gray-100">
        <main className="flex-1 p-6">
            <AudioTranslationChat />
        </main>
        </div>
    );
    }
