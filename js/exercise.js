$(function () {
    //拉取题目数据
    ajaxPost('json', '../Handler/handler.php?action=pull', {code: $('body').attr('code')}, function (msg) {
        $('.title').text(msg[1]);
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
        $('.exercise_post').removeClass('hide');
        $('.default').remove();
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