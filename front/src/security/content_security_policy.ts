export const CSP_CONFIG = {
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            // "https://your-cdn.com"
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        baseUri: ["'self'"]
    }
};