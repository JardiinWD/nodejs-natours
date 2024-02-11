// INSERT COMMENT HERE
import { login } from "./login"
// INSERT COMMENT HERE
import '@babel/polyfill'

// VALUES
const loginForm = document.querySelector('.form')

if (loginForm) {
    // Adds an event listener to the form submission
    loginForm.addEventListener('submit', (e) => {
        // Prevents the default form submission behavior
        e.preventDefault()
        // Retrieves the email and password from the form inputs
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        // Calls the login function with the provided credentials
        login(email, password)
    })
}


