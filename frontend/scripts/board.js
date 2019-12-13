"use strict";

$(document).ready(function() {
    if (window.location.href.includes('?')) {
        let pageUrl = window.location.href.split(`?`);
        if (pageUrl.length === 2) {
            let username = decodeURIComponent(pageUrl[1].split(`=`)[1]);
            $('#gameLink').attr('href', `/game.html?username=${username}`);
            $('#optionsLink').attr('href', `/options.html?username=${username}`);
            $.ajax({
                type: `GET`,
                url: `/scores`,
                datatype: `json`,
                success: data => {
                    let tableBody = $(`#scores`);
                    tableBody.css(`font-weight`, `bold`);
                    while (data.scores.length !== 0) {
                        let elem = data.scores.pop();
                        let tableRow = $(`<tr></tr>`);
                        tableRow.append(`<td>${elem.username}</td>`);
                        tableRow.append(`<td>${(new Date(elem.date)).toLocaleString()}</td>`);
                        tableRow.append(`<td>${elem.score}</td>`);
                        tableBody.append(tableRow);
                    }
                }
            });
        }
    }
});

