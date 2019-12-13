"use strict";

$(`#submit`).on(`click`, ev => {
    ev.preventDefault();
    $.ajax({
        type: `POST`,
        url: `/user`,
        data: {
            username : $(`#username`).val(),
            password : $(`#password`).val(),
        },
        dataType: `json`,
        success: data => window.location = `/options.html?username=${data.username}`,
        error: err => {
            $(`#error`).text(err.responseJSON.error);
        },
    });
});