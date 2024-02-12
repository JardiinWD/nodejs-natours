// Function to hide alert messages
export const hideAlert = () => {
    // Select the alert element
    const element = document.querySelector('.alert')
    // Check if the element exists
    if (element) {
        // Remove the alert element from its parent node
        element.parentElement.removeChild(element)
    }
}

/** Function to display alert messages
 * @param {string} type - The type of alert (e.g., 'success', 'error')
 * @param {string} message - The message to be displayed in the alert
 */
export const showAlert = (type, message) => {
    // Hide any existing alerts
    hideAlert();
    // Generate HTML markup for the alert message
    const markup = `<div class='alert alert--${type}'>${message}</div>`
    // Insert the alert markup at the beginning of the body element
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
    // Set a timeout to hide the alert after 4 seconds
    window.setTimeout(hideAlert, 4000)
}
