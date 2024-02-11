// INSERT COMMENT HERE
import { login, logout } from "./login"
// INSERT COMMENT HERE
import '@babel/polyfill'

// DOM ELEMENTS
const loginForm = document.querySelector('.form')
const logoutButton = document.querySelector('.nav__el--logout')

// INSERT COMMENT HERE
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


// INSERT COMMENT HERE
if (logoutButton) {
    // INSERT COMMENT HERE
    logoutButton.addEventListener('click', logout)
}

