// INSERT COMMENT HERE
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
        // INSERT COMMENT HERE
        if (data.status === 'success') {
            // INSERT COMMENT HERE
            showAlert('success', 'Logged in successfully')
            // INSERT COMMENT HERE
            window.setTimeout(() => {
                // INSERT COMMENT HERE
                location.assign('/')
            }, 1500)
        }
    } catch (error) {
        // Logs any errors that occur during the login process
        showAlert('error', error.message)
    }
}

/** Function to log out a user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 */
export const logout = async () => {
    console.log('TAPPED ON LOGOUT');
    try {
        // INSERT COMMENT HERE
        const response = await fetch('http://localhost:7775/api/v1/users/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        // Parses the response JSON data
        const data = await response.json();
        console.log(data);
        // INSERT COMMENT HERE
        if (data.status === 'success') {
            // INSERT COMMENT HERE
            location.reload(true)
        }
    } catch (error) {
        console.error(error.message)
        // INSERT COMMENT HERE
        showAlert('error', 'Error loggin out! Try again.')
    }
}

