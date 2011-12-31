$(function() {
    (function update_cursor () {
        if ($("#cursor").html() == "_") {
            $("#cursor").html("");
        } else {
            $("#cursor").html("_");
        }
        timer = setTimeout(update_cursor, 500);
    })();
    (function () {
        for (var i = 0; i < 20; ++i) {
            cmdline = $('<div></div>').addClass('cmdline');
            if (i == 0) {
                cmdline.addClass('current').append($('<input type="text" id="input_area"/>'));
            }
            $("#lines").append(cmdline);
        }
    })();
});
