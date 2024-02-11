

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
            alert('Logged in successfully')
            // INSERT COMMENT HERE
            window.setTimeout(() => {
                // INSERT COMMENT HERE
                location.assign('/')
            }, 1500)
        }
    } catch (error) {
        // Logs any errors that occur during the login process
        alert(error.message)
    }
}


