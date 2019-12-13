"use strict";

$(document).ready(function() {
    if (window.location.href.includes('?')) {
        let pageUrl = window.location.href.split(`?`);
        if (pageUrl.length === 2) {
            let username = decodeURIComponent(pageUrl[1].split(`=`)[1]);
            $('#profileLink').attr('href', `/user.html?username=${username}`);
            $('#gameLink').attr('href', `/game.html?username=${username}`);
            $('#boardLink').attr('href', `/board.html?username=${username}`);
        }
    }
});

$(`#logout`).on(`click`, ev => {
    ev.preventDefault();
    $.ajax({
        type: `DELETE`,
        url: `/login`,
        success: () => {
            window.location.href = '/index.html'
        }
    });
});