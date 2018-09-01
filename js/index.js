$(function () {
    $('.new').click(function () {
        $('#psw').modal({backdrop: "static"});
    });
    $('#psw').on('shown', function () {
        $('.psw_input').focus();
    })
})