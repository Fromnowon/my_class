$(function () {
    //拉取题目数据
    ajaxPost('json', '../Handler/handler.php?action=pull', {code: $('body').attr('code')}, function (msg) {
        //console.log(msg);
        //读取标题
        $('.title').text(msg[1]);
        //读取题干
        $.each(JSON.parse(msg[0]), function (index, json) {
            $('.insert_flag').before($('.default').clone().removeClass('e0').addClass('e' + (parseInt(index) + 1)));
            var clone = $('.e' + (parseInt(index) + 1));
            clone.find('.num').text(parseInt(index) + 1);
            //填充数据
            $.each(json, function (count, item) {
                switch (count) {
                    case 'stem': {
                        //题干
                        clone.find('.stem').text(item);
                        break;
                    }
                    case 'answer': {
                        clone.find('.answer_default').remove();
                        $.each(item, function (index_t, value) {
                            clone.find('.answer_div').find('table').append($('.default').find('.answer_default').clone().removeClass('answer_default')).find('input').eq(index_t).attr('name', 'a' + index).next().text(value);
                        })
                        break;
                    }
                }
            })
            clone.removeClass('hide default');
        })
        //读取附件
        //console.log(JSON.parse(msg[2]))
        var img_arr = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
        $.each(JSON.parse(msg[2]), function (num, value) {
            if (!value.empty) {
                delete value['empty'];
                num = parseInt(num) + 1;
                var exercise = $('.exercise').eq(num);
                if (exercise.find('.attachment').hasClass('hide')) exercise.find('.attachment').removeClass('hide');
                $.each(value, function (index, item) {
                    //console.log(item);
                    for (var key in item)
                        var src = '../userdata/' + item[key];
                    console.log(src);
                    //console.log(item[key].substr(item[key].lastIndexOf('.') + 1));
                    if ($.inArray(((item[key].substr(item[key].lastIndexOf('.') + 1)).toLowerCase()), img_arr) != -1) {
                        exercise.find('.attachment_div').append("<div class='attachment_file'>" + "<div class='hide attachment_src'>../userdata/" + item[key] + "</div>" + "<img src='" + src + "'/><br><span>" + key + "</span>" +
                            "<div class='attachment_controller'><a href='" + src + "' download='" + key + "'><i class='fa fa-download fa-lg' title='下载附件'></i></a>&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' onclick='attachment_detail($(this))'><i class='fa fa-search-plus fa-lg' title='查看详情'></i></a></div>"
                            + "</div>");
                    } else {
                        exercise.find('.attachment_div').append("<div class='attachment_file'>" + "<div class='hide attachment_src'>../userdata/" + item[key] + "</div>" + "<img src='../img/file_default.png'/><br><span>" + key + "</span>" +
                            "<div class='attachment_controller'><a href='" + src + "' download='" + key + "'><i class='fa fa-download fa-lg' title='下载附件'></i></a></div>"
                            + "</div>");
                    }
                    $('.attachment_file').off().hover(function () {
                        $(this).find('.attachment_controller').stop().fadeIn();
                    }, function () {
                        $(this).find('.attachment_controller').stop().fadeOut();
                    })
                })
            }
        })

        $('.exercise_post').removeClass('hide');
        $('.default').remove();
        $('.loading').fadeOut();
    })

    //提交按钮
    $('.exercise_post').click(function () {
        $('#post_name').modal({backdrop: "static"});
        $('.post').off().click(function () {
            var data = [{ip: $('body').attr('ip'), code: $('body').attr('code'), name: $('.post_name_input').val()}];
            var data_t = [];
            var not_choose = [];
            //校验并获取选项
            $('.exercise').each(function (num, exercise) {
                //遍历答案
                var flag = 0;
                $(this).find('input').each(function (index, value) {
                    if ($(this).is(':checked')) {
                        data_t.push({num: num, choose: index});
                        flag = 1;
                    }
                })
                if (!flag) {
                    //此题未选择答案
                    not_choose.push(num + 1);
                }
            })
            //组合数据
            data.push(data_t);
            //console.log(data);
            if (not_choose.length != 0) {
                //未选择答案的题号
                alert('第' + not_choose.toString() + '题未选择答案，请检查');
                $('#post_name').modal('hide');
            } else {
                console.log(data);
                ajaxPost('text', '../Handler/handler.php?action=post', {data: JSON.stringify(data)}, function (msg) {
                    if (msg == 'ok') {
                        alert('提交成功');
                    } else alert('提交失败！请联系管理员');
                })
            }
        })
    })

    //提交前填写姓名相关
    $('#post_name').on('shown', function () {
        $('.post_name_input').focus();
    })
    $('.post_name_input').bind('keyup', function () {
        if ($(this).val().length > 0) {
            $('.post').removeAttr('disabled');
            $('.post').removeClass('disable_btn');
        } else {
            $('.post').attr('disabled', true).addClass('disable_btn');
            $('.post').addClass('disable_btn');
        }
    })

    //数据监测
    if ($('body').attr('code') == 'null') {
        alert('数据异常，链接缺少参数');
        $('.exercise_post').hide();
    }


})

function attachment_detail(obj) {
    var src = obj.parents('.attachment_file').find('.attachment_src').text();
    $('.attachment_detail_div').html("<img src='" + src + "'/>");
    $('.attachment_detail_div').fadeIn(function () {
        $(this).off().click(function () {
            $(this).fadeOut();
            $(this).html('');
        })
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