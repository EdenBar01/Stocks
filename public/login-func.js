function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errors = validateForm(username, password);
    if (errors.length > 0) {
        // Display the error messages to the user
        for (let i = 0; i < errors.length; i++) {
            alert(errors[i]);
        }
    } else {
        const requestBody = JSON.stringify({ username, password });

        // Send the request
        fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestBody
        })
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
          // Handle the response data
          if (data.success) {
            alert(data.message);

            // Perform any additional actions or redirect the user to another page
          } else {
            alert(data.message);
          }
        })
        .catch(error => {
          console.error('An error occurred:', error);
        });
    }
}


// function submitSignupForm1(){
//     res.post('/api/signup', {
// }
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
      errors.forEach((error) => {
        alert(error);
      });
    } else {
        const requestBody = JSON.stringify({ username, password });

        // Send the request
        fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestBody
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response data
            if (data.success) {
              alert(data.message);
            } else {
              alert('Invalid username or password. Please try again.');
            }
          })
          .catch(error => {
            console.error('An error occurred:', error);
            alert(error);
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
