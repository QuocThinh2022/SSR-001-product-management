

// show alert 
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const time = parseInt(showAlert.getAttribute('data-time')) || 1500;
    const closeAlert = showAlert.querySelector('[close-alert]');
    setTimeout(() => {
        showAlert.classList.add('alert-hidden');
    }, time);

    closeAlert.addEventListener('click', () => {
        showAlert.classList.add('alert-hidden');
    })
}
// end show alert 

// button-go-back 
const buttonsGoBack = document.querySelectorAll('[button-go-back]')
if (buttonsGoBack.length > 0) {
    buttonsGoBack.forEach(button => {
        button.addEventListener('click', () => {
            history.back()
        })
    })
}
// end button-go-back 