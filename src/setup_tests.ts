import { BrowserHardening } from './security/BrowserHardening';

// Глобальная установка для тестов
beforeAll(() => {
    BrowserHardening.disableFeatures();
});