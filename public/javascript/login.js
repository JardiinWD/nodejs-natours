/** Function to log in a user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 */
const login = async (email, password) => {
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
        console.log(data);
    } catch (error) {
        // Logs any errors that occur during the login process
        console.error('😨 ERROR', error)
    }
}

// Adds an event listener to the form submission
document.querySelector('.form').addEventListener('submit', (e) => {
    // Prevents the default form submission behavior
    e.preventDefault()
    // Retrieves the email and password from the form inputs
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    // Calls the login function with the provided credentials
    login(email, password)
})
