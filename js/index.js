$(function () {
    $('.new').click(function () {
        $('#psw').modal({backdrop: "static"});
    });
    $('#psw').on('shown', function () {
        $('.psw_input').focus();
    });
    $('#psw').on('hidden', function () {
        $('.psw_input').val('');
    });
    $('.psw_post').click(function () {
        psw_post();
    });
    $('.psw_input').on('keydown', function (e) {
        if (e.keyCode == 13) psw_post();
    });

    $('.history_btn').click(function () {
        $('#history').modal({backdrop: "static"});
    });
    $('#history').on('shown', function () {
        //拉取历史数据
        ajaxPost('text', './Handler/handler.php?action=history', {}, function (msg) {
            console.log(msg);
            for (var item in msg) {
                $('.history_body').append(item);
            }
        })
    })
});

function psw_post() {
    $('.psw_post').addClass('disabled');
    ajaxPost('text', './Handler/handler.php?action=validate', {psw: $('.psw_input').val()}, function (msg) {
        if (msg == 'ok') {
            //跳转
            $('#psw').modal('hide');
            window.location.href = './main/new.php';
        } else {
            alert('错误');
            $('.psw_post').removeClass('disabled');
        }
    })
}

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