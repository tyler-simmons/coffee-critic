$(document).ready(function() {
    //const username = $('#username');
    const password = $('#password');
    const confirm = $('#confirm');
    const checkUsernameButton = $('#usernameCheck');
    

    confirm.change(function() {
        if (this.value != password.value) {
            alert('Passwords must match, please re-enter password');
            password.val('');
            confirm.val('');
        }
    });

    checkUsernameButton.click(function() {
        let username = $('#username').val();
        console.log(username);
        $.getJSON(`api/usernames/checkAvailability/${username}`, function(data) {
            if (data.unique == true) {
                $('#username-message').text('That username is available');
            } else {
                //$('#username').val('');
                $('#username-message').text('That username is taken');
            }
        })
    });

    $('#username').focusin(function() {
        console.log('focus in event')
        if ($('#username-message').text() != "" || $('#username-message').text() != 'That username is available') {
            $('#username-message').text("");
        }
    })
    $('#username').focusout(function() {
        console.log('focus out event')
        if ($('#username-message').text() != "" || $('#username-message').text() != 'That username is available') {
            $('#username-message').text("");
        }
    })
});