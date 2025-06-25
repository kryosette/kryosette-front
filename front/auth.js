import jwtDecode from 'jwt-decode';

export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) {
        return false;
    }

    try {
        const decodedToken = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();

        return !isExpired;
    } catch (error) {
        return false;
    }
};

export const getUserInfo = () => {
    const token = getToken();
    if (!token) {
        return null;
    }

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};