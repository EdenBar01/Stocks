function login() {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errors = validateForm(email, password);
    if (errors.length > 0) {
        // Display the error messages to the user
        for (let i = 0; i < errors.length; i++) {
            alert(errors[i]);
        }
    } else {
        $.post('/api/users/login', { email, password })
            .done(function(response) {
                // Check the response from the server
                if (response.success) {
                    alert('Login successful!');
                    // Perform any additional actions or redirect the user to another page
                } else {
                    alert('Invalid username or password. Please try again.');
                }
            })
            .fail(function(error) {
                console.error('An error occurred:', error);
            });
    }
}

function submitSignupForm() {
    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;


    // Check if the passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }
    const errors = validateForm(username, password);
    if (errors.length > 0) {
        // Display the error messages to the user
        for (let i = 0; i < errors.length; i++) {
            alert(errors[i]);
        }
    }
    else{ 
        // Make an API call to register a new user
        $.post('/api/users/register', { username, password })
        .done(function(response) {
            // Check the response from the server
            if (response.success) {
            alert('Signup successful! You can now login with your new account.');
            // Perform any additional actions or redirect the user to another page
            } else {
            alert('Signup failed. Please try again.');
            }
        })
        .fail(function(error) {
            console.error('An error occurred:', error);
        });
    }
}

function validateForm(email, password) {
    let errorMessages = [];

    if (!validateEmail(email) || email.trim() === "") {
        errorMessages.push("Please enter a valid email address");
    }
    if (!validatePassword(password) || password.trim() === "") {
        errorMessages.push("Please enter a valid password");
    }

    return errorMessages;
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\|[\]{};:/?.,><])[A-Za-z\d!@#$%^&*()\-_=+\\|[\]{};:/?.,><]{6,}$/;
    return passwordRegex.test(password);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
