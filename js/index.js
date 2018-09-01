$(function () {
    $('.new').click(function () {
        $('#psw').modal({backdrop: "static"});
    });
    $('#psw').on('shown', function () {
        $('.psw_input').focus();
    })
    $('.psw_post').click(function () {
        ajaxPost('text', './Handler/handler.php?action=validate', {psw: $('.psw_input').val()}, function (msg) {
            if (msg=='ok'){
                //跳转

            }else alert('错误')
        })
    })
})

function ajaxPost(type, url, data, fun) {
    $.ajax({
        type: "POST",
        dataType: type,
        url: url,
        data: data,
        async: true,
        success: function (msg) {
            //console.log('success:' + msg);
            fun(msg);
        },
        error: function (msg) {
            alert('error');
            console.log('error:' + msg);
        }
    });
}