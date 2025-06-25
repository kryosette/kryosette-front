import Cookies from 'js-cookie';

function setCookie(name, value, options) {
    if (isConsentGiven()) {
        Cookies.set(name, value, options);
    }
}

function getCookie(name) {
    return Cookies.get(name);
}

function deleteCookie(name) {
    Cookies.remove(name);
}

function isConsentGiven() {
    return localStorage.getItem('cookieConsent') === 'true';
}