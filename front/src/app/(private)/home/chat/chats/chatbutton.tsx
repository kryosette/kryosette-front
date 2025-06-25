import { useAuth } from "@/lib/auth-provider";

export const OpenChatButton = () => {
    const { token, login } = useAuth();

    const handleOpenChat = () => {
        if (!token) {
            login(); // Авторизуем, если не авторизованы
        }

        const chatWindow = window.open('http://localhost:5173', '_blank');

        // Даем время на загрузку чата
        setTimeout(() => {
            chatWindow.postMessage(
                { type: 'auth_token', token: token },
                'http://localhost:5173'
            );
        }, 1000);
    };

    return (
        <button onClick={handleOpenChat}>
            Открыть чат
        </button>
    );
};