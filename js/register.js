// js/register.js
function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{3,}$/.test(username);
}
function isValidPassword(password) {
    return password.length >= 6;
}

$(document).ready(function () {
    // Redirect to profile if already logged in
    if (localStorage.getItem('session')) {
        window.location.href = 'profile.html';
        return;
    }

    $('#registerBtn').click(function () {
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();

        if (!username) {
            alert('Username is required.');
            return;
        }
        if (!isValidUsername(username)) {
            alert('Username must be at least 3 characters and contain only letters, numbers, or underscores.');
            return;
        }
        if (!password) {
            alert('Password is required.');
            return;
        }
        if (!isValidPassword(password)) {
            alert('Password must be at least 6 characters.');
            return;
        }

        $.ajax({
            url: 'php/register.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (res) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            },
            error: function (err) {
                let msg = 'Registration failed.';
                if (err.responseJSON && err.responseJSON.error) {
                    msg += ' ' + err.responseJSON.error;
                } else if (err.responseText) {
                    msg += ' ' + err.responseText;
                }
                alert(msg);
            }
        });
    });
});