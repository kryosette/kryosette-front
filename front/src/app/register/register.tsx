import axios from 'axios';

const API_BASE_URL = 'http://localhost:8088'; // Replace with your actual API base URL

/**
 * Registers a new user.
 * @param {object} registrationData - An object containing the registration details
 *        like firstName, lastName, email, password.  Needs to match the
 *        RegistrationRequest structure expected by your Spring Boot backend.
 * @returns {Promise<void>} A promise that resolves when registration is successful.
 * @throws {Error} If the registration fails.
 */
const registerUser = async (registrationData: any) => {
    try {
        await axios.post(`${API_BASE_URL}/api/v1/auth/register`, registrationData, {
            headers: {
                'Content-Type': 'application/json' // Explicitly set content type
            }
        });
        console.log("Registration successful");
        // Optionally, you might want to display a success message to the user
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;  // Re-throw the error so the calling component can handle it
    }
};

export default registerUser;