
// INSERT COMMENT HERE
export const hideAlert = () => {
    // INSERT COMMENT HERE
    const element = document.querySelector('.alert')
    // INSERT COMMENT HERE
    if (element) element.parentElement.removeChild(element)
}

/** INSERT COMMENT HERE
 * @param {INSERT} type INSERT COMMENT HERE
 * @param {INSERT} message INSERT COMMENT HERE
 */
export const showAlert = (type, message) => {
    // INSERT COMMENT HERE
    hideAlert();
    // INSERT COMMENT HERE
    const markup = `<div class='alert alert--${type}>${message}</div>`
    // INSERT COMMENT HERE
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
    // INSERT COMMENT HERE
    window.setTimeout(hideAlert, 4000)
}
