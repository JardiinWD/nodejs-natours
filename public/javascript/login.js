// Import showAlert function from the alerts module
import { showAlert } from "./alerts";

/** Function to log in a user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 */
export const login = async (email, password) => {
    try {
        // Sends a POST request to the login endpoint
        const response = await fetch('http://localhost:7775/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        // Parses the response JSON data
        const data = await response.json();
        // Check if login was successful
        if (data.status === 'success') {
            // Display success alert
            showAlert('success', 'Logged in successfully')
            // Redirect to homepage after 1.5 seconds
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (error) {
        // Display error alert if login fails
        showAlert('error', error.message)
    }
}

/** Function to log out a user. */
export const logout = async () => {
    try {
        // Sends a GET request to the logout endpoint
        const response = await fetch('http://localhost:7775/api/v1/users/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        // Parses the response JSON data
        const data = await response.json();
        console.log(data);
        // Check if logout was successful
        if (data.status === 'success') {
            // Reload the page to log out
            location.reload(true)
        }
    } catch (error) {
        console.error(error.message)
        // Display error alert if logout fails
        showAlert('error', 'Error logging out! Try again.')
    }
}
