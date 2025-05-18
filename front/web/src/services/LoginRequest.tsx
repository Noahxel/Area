import axios from 'axios';

async function authenticateUser(email: string, password: string): Promise<string | null> {
    try {
        const response = await axios.post('https://your-api-endpoint/login', {
            email: email,
            password: password
        });

        if (response.status === 200 && response.data.token) {
            localStorage.setItem('userToken', response.data.token);
            return response.data.token;
        }

        return null;
    } catch (error) {
        console.error("Authentication error:", error);
        return null;
    }
}

export default authenticateUser;
