export const config = {
    API_URL: process.env.BASE_BACKEND_URL || "http://localhost:8088/",
    // Другие настройки...
};

// Проверка при старте приложения
if (!config.API_URL) {
    console.error("BACKEND_URL не задан в .env");
}