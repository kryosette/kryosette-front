import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { baseURL } from "../../chat/config/AxiosHelper";
import { useAuth } from "@/lib/auth-provider";

class StatusService {
    private stompClient: Stomp.Client | null = null;

    connect(userId: string, token: string, onStatusChange: (isOnline: boolean) => void) {

        const socket = new SockJS(`${baseURL}/api/v1/ws-status`);
        this.stompClient = Stomp.over(socket);

        // const headers = {
        //     'Authorization': `Bearer ${token}`, // Получаем токен (пример)
        //     // Другие заголовки, если нужны
        // };
        // console.log("WebSocket connecting with headers:", headers);

        this.stompClient.connect({
            Authorization: `Bearer ${token}`
        }, () => {
            // Подписываемся на обновления статуса
            this.stompClient?.subscribe(`/topic/status/${userId}`, (message) => {
                const statusMessage: { online: boolean } = JSON.parse(message.body);
                onStatusChange(statusMessage.online);
            })

            this.sendStatus(true, token);
        });

        // Отслеживаем закрытие вкладки/браузера
        window.addEventListener('beforeunload', () => this.sendStatus(false, token));
    }

    sendStatus(isOnline: boolean, token: string) {
        this.stompClient.send('/app/status.update', { 'Authorization': `Bearer ${token}` }, JSON.stringify({ online: isOnline }));
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
        }
    }
}

export const statusService = new StatusService();