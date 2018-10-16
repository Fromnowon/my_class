$(function () {
    $('.new').click(function () {
        $('#psw').modal({backdrop: "static"});
    });
    $('#psw').on('shown', function () {
        $('.psw_input').focus();
    });
    $('#psw').on('hidden', function () {
        $('.psw_input').val('');
        if ($('#psw').attr('flag') == 'analysis') {
            //此时正在验证分析权限
            $('#psw').removeAttr('flag');
            $('#history').modal({backdrop: "static"});
        }
    });
    $('.psw_post').click(function () {
        psw_post($('#psw').attr('code'));
    });
    $('.psw_input').on('keydown', function (e) {
        if (e.keyCode == 13) psw_post($('#psw').attr('code'));
    });
    //分析
    $('.history_body').on('click', '.analysis_btn', function () {
        $('#psw').attr({'flag': 'analysis', 'code': $(this).attr('value')});
        $('#history').modal('hide');
        $('#psw').modal({backdrop: "static"});
    })

    //分页
    $('.page_btn').on('click', '.page_prev', function () {
        if ($(this)[0].tagName != 'A') {//不为A标签时不响应点击事件
            return;
        }
        var page_num = $('.page_btn').attr('value');//当前页数
        //console.log(page_num);
        var page_new = parseInt(page_num) - 1;
        pull_history(page_new);
        $('.page_btn').attr('value', page_new);//更新标记
    })
    $('.page_btn').on('click', '.page_next', function () {
        if ($(this)[0].tagName != 'A') {//不为A标签时不响应点击事件
            return;
        }
        var page_num = $('.page_btn').attr('value');//当前页数
        var page_new = parseInt(page_num) + 1;
        pull_history(page_new);
        $('.page_btn').attr('value', page_new);//更新标记
    })

    //跳页
    $('.page_jump').click(function () {
        var page_num = $(this).prev().val();
        if (page_num != '') {
            pull_history(page_num);
        }
    });

    $('.history_btn').click(function () {
        $('#history').modal({backdrop: "static"});
    });
    $('#history').on('shown', function () {
        $('.page_btn').attr('value', 1);//更新标记
        pull_history(1);
    })

    function pull_history(page) {
        //拉取历史数据
        var result = 'normal';
        ajaxPost('text', './Handler/handler.php?action=history', {page: page}, function (msg) {
            var group = JSON.parse(msg);
            if (group.length < 5) {
                //已到最后一页
                $('.page_next').replaceWith("<span class='page_next'>下一页</span>");
                if (page > 1) {
                    $('.page_prev').replaceWith("<a href='javascript:void(0)' class='page_prev'>上一页</a>");
                }
            } else {
                if ($('.page_next')[0].tagName == 'SPAN') {
                    $('.page_next').replaceWith("<a href='javascript:void(0)' class='page_next'>下一页</a>");
                }
                if (page == 1) {
                    $('.page_prev').replaceWith("<span class='page_prev'>上一页</span>");
                }
            }
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
                            html += ('<td>' + val + '</td>' + '<td><a class="btn btn-primary" target="_blank" href="' + './main/exercise.php?code=q' + code + '">打开</a>&nbsp;<a class="btn btn-success analysis_btn" value="q' + code + '" href="javascript:void(0)">统计</a></td>' + '</tr>');
                            break;
                    }
                })
            }
            $('.history_body table').addClass('table table-bordered').html("<tr><th>序号</th><th>标题</th><th>发布时间</th><th>操作</th></tr>" + html);
            $('.page_btn').removeClass('hide');
        })
        return result;
    }
});

function psw_post(value) {
    ajaxPost('text', './Handler/handler.php?action=validate', {psw: $('.psw_input').val()}, function (msg) {
        if (msg == 'ok') {
            //跳转
            if ($('#psw').attr('flag') == 'analysis') {
                window.open('./main/analysis.php?code=' + value);
                $('#psw').removeAttr('flag value');
            } else {
                window.open('./main/new.php');
            }
            $('#psw').modal('hide');
        } else {
            alert('错误');
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