function isValidAge(age) {
    return /^\d+$/.test(age) && age >= 0 && age <= 120;
}
function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
}
function isValidDOB(dob) {
    if (!dob) return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return false;
    const [year, month, day] = dob.split('-').map(Number);
    if (year < 1900) return false;
    if (month < 1 || month > 12) return false;
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;
    const dobDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (dobDate > today) return false;
    return true;
}

function doesAgeMatchDOB(age, dob) {
    if (!age || !dob) return true;
    const [year, month, day] = dob.split('-').map(Number);
    const dobDate = new Date(year, month - 1, day);
    const today = new Date();
    let calcAge = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        calcAge--;
    }
    return Number(age) === calcAge;
}

$(document).ready(function () {
    // Prevent back navigation from profile page
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        if (localStorage.getItem('session')) {
            history.pushState(null, null, location.href);
        } else {
            window.location.replace('login.html');
        }
    };

    // Force reload if coming from back/forward cache
    if (performance && performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
        location.reload();
    }

    const session = localStorage.getItem('session');
    const username = localStorage.getItem('username');
    if (!session) {
        window.location.replace('login.html');
        return;
    }

    $('#usernameDisplay').text(username);

    $.ajax({
        url: 'php/profile.php',
        method: 'GET',
        headers: { 'Authorization': session },
        success: function (profile) {
            if (!profile) {
                alert('Session expired or profile not found. Please login again.');
                localStorage.removeItem('session');
                localStorage.removeItem('username');
                window.location.replace('login.html');
                return;
            }
            $('#age').val(profile.age || '');
            $('#dob').val(profile.dob || '');
            $('#contact').val(profile.contact || '');
        },
        error: function () {
            alert('Session expired. Please login again.');
            localStorage.removeItem('session');
            localStorage.removeItem('username');
            window.location.replace('login.html');
        }
    });

    $('#updateBtn').click(function () {
        const age = $('#age').val().trim();
        const dob = $('#dob').val().trim();
        const contact = $('#contact').val().trim();

        if (!age && !dob && !contact) {
            alert('No data to update.');
            return;
        }
        if (age && !isValidAge(age)) {
            alert('Please enter a valid age (0-120).');
            return;
        }
        if (dob && !isValidDOB(dob)) {
            alert('Please select a valid date of birth (not in the future, from 1900 onwards).');
            return;
        }
        if (age && dob && !doesAgeMatchDOB(age, dob)) {
            alert('Age does not match date of birth.');
            return;
        }
        if (contact && !isValidPhone(contact)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        $.ajax({
            url: 'php/profile.php',
            method: 'POST',
            headers: { 'Authorization': session },
            contentType: 'application/json',
            data: JSON.stringify({ age, dob, contact }),
            success: function () {
                alert('Profile updated!');
                $('#age').val('');
                $('#dob').val('');
                $('#contact').val('');
            },
            error: function () {
                alert('Update failed.');
            }
        });
    });

    $('#logoutBtn').click(function () {
        localStorage.removeItem('session');
        localStorage.removeItem('username');
        window.location.replace('login.html');
    });
});