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
        ajaxPost('text', './Handler/handler.php?action=history', {page: 1}, function (msg) {
            var group = JSON.parse(msg);
            console.log(group);
            var html = '';
            for (var num in group) {
                //遍历每一组
                var code;
                $.each(group[num], function (index, val) {
                    switch (index) {
                        case 'id':
                            html += ('<tr><td>' + val + '</td>');
                            code = val - 1;//题组号
                            break;
                        case 'title':
                            html += ('<td>' + val + '</td>');
                            break;
                        case 'create_time':
                            html += ('<td>' + val + '</td>' + '<td><a class="btn btn-primary" target="_blank" href="' + './main/exercise.php?code=q' + code + '">打开</a></td>' + '</tr>');
                            break;
                    }
                })
            }
            $('.history_body table').addClass('table table-bordered').html("<tr><th>序号</th><th>标题</th><th>发布时间</th><th>操作</th></tr>" + html);
            $('.page_btn').removeClass('hide');
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

function debug(obj) {
    console.log(obj + '\n');
}