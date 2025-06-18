// js/login.js
$(document).ready(function () {
    // Redirect to profile if already logged in
    if (localStorage.getItem('session')) {
        window.location.replace('profile.html'); // Use replace to prevent back navigation
        return;
    }

    $('#loginBtn').click(function () {
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        $.ajax({
            url: 'php/login.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (res) {
                localStorage.setItem('session', res.session);
                localStorage.setItem('username', username);
                window.location.replace('profile.html'); // Use replace to prevent back navigation
            },
            error: function (err) {
                let msg = 'Login failed.';
                if (err.responseJSON && err.responseJSON.error) {
                    msg += ' ' + err.responseJSON.error;
                } else if (err.responseText) {
                    msg += ' ' + err.responseText;
                }
                alert(msg);
            }
        });
    });

    // Back to Home button
    $('#toIndexBtn').click(function () {
        window.location.href = 'index.html';
    });
});