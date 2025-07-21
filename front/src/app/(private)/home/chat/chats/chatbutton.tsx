import { useAuth } from "@/lib/auth-provider";

/**
 * OpenChatButton Component
 * 
 * @component
 * @description
 * Provides a button that opens a chat window in a new tab and handles authentication.
 * If the user is not authenticated, it triggers the login flow before opening the chat.
 * Once the chat window is opened, it sends the authentication token via postMessage.
 * 
 * @example
 * <OpenChatButton />
 * 
 * @hooks
 * - useAuth: Provides authentication token and login function
 * 
 * @requires
 * - The chat application must be running on http://localhost:5173
 * - The chat application must be listening for 'auth_token' messages
 */
export const OpenChatButton = () => {
    // @ts-ignore
    const { token, login } = useAuth();

    /**
     * Handles the chat window opening process
     * 
     * @function
     * @description
     * - Checks if user is authenticated, triggers login if not
     * - Opens chat application in new window
     * - Sends authentication token to chat window after 1 second delay
     * 
     * @sideeffects
     * - May trigger authentication flow
     * - Opens new browser window
     * - Sends postMessage to new window
     */
    const handleOpenChat = () => {
        if (!token) {
            login();
            return; // Return early to prevent opening chat before auth completes
        }

        const chatWindow = window.open('http://localhost:5173', '_blank', 'noopener,noreferrer');

        if (chatWindow) {
            // Give chat time to load before sending token
            const authInterval = setInterval(() => {
                try {
                    chatWindow.postMessage(
                        { type: 'auth_token', token: token },
                        'http://localhost:5173'
                    );
                    clearInterval(authInterval);
                } catch (e) {
                    // Chat window not ready yet, will retry
                }
            }, 500);
        }
    };

    return (
        <button
            onClick={handleOpenChat}
            aria-label="Open chat in new window"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
            Open Chat
        </button>
    );
};