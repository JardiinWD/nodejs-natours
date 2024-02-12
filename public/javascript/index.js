// Import login and logout functions from the login module
import { login, logout } from "./login"
// Import the babel polyfill for compatibility with older browsers
import '@babel/polyfill'

// DOM ELEMENTS
const loginForm = document.querySelector('.form')
const logoutButton = document.querySelector('.nav__el--logout')

// Check if the login form exists
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

// Check if the logout button exists
if (logoutButton) {
    // Adds an event listener to the logout button
    logoutButton.addEventListener('click', logout)
}
