export class BrowserHardening {
    static disableFeatures(): void {
        this.disableConsole();
        this.overrideDangerousAPIs();
        this.blockFingerprinting();
    }

    private static disableConsole(): void {
        if (process.env.NODE_ENV === 'production') {
            const noop = (): void => { };
            console.log = noop;
            console.info = noop;
            console.warn = noop;
            console.error = noop;
            console.debug = noop;
        }
    }

    private static overrideDangerousAPIs(): void {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition = () => {
                throw new Error('Geolocation disabled');
            };
            navigator.geolocation.watchPosition = () => {
                throw new Error('Geolocation disabled');
            };
        }

        if ('clipboard' in navigator) {
            navigator.clipboard.readText = () => {
                throw new Error('Clipboard access disabled');
            };
        }

        if ('mediaDevices' in navigator) {
            navigator.mediaDevices.getUserMedia = () => {
                throw new Error('Media access disabled');
            };
        }
    }

    private static blockFingerprinting(): void {
        Object.freeze(navigator);

        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (...args) {
            const context = originalGetContext.apply(this, args);
            if (context && 'getImageData' in context) {
                context.getImageData = () => {
                    throw new Error('Canvas access disabled');
                };
            }
            return context;
        };
    }
}