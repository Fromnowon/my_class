$(function () {
    var container = $('.container');

    //增加备选答案
    container.on('click', '.add_answer', function () {
        //限制答案数量
        if ($(this).prev().attr('num') == '10') {
            alert('备选答案应不多于10个');
        }
        else {
            $(this).prev().after($(this).parents('.exercise_choose').find('.choose_default').clone().removeClass('choose_default hide'));
            $(this).prev().attr('num', parseInt($(this).prev().prev().attr('num')) + 1);
        }
    })
    //删除备选答案
    container.on('click', '.del_answer', function () {
        //重新处理num值
        var next = $(this).parent().next();//获取即将被删除div的下一个元素
        while (next.hasClass('exercise_answer')) {
            next.attr('num', parseInt(next.attr('num')) - 1);
            next = next.next();
        }
        $(this).parent().remove();
    })

    //指定标准答案
    container.on('click', '.set_right_answer', function () {
        if ($(this).parent().hasClass('right_answer')) {
            $(this).parent().removeClass('right_answer').find('.fa-check').css('color', '#cbcbcb');
        } else {
            //互斥，清除其他标准答案
            $('.right_answer').removeClass('right_answer').find('.fa-check').css('color', '#cbcbcb');
            $(this).parent().addClass('right_answer').find('.fa-check').css('color', 'black');
        }
    })

    //新增题目
    container.on('click', '.add_exercise', function () {
        $(this).parent().before($('.exercise_default').clone()).prev().removeClass('exercise_default').css('display', 'block');
        $(this).parent().prev().find('.exercise_num').text(parseInt($(this).parent().prevAll('div').eq(1).find('.exercise_num').text()) + 1);
        $('.exercise_total').text(parseInt($('.exercise_total').text()) + 1);
    })

    //删除题目
    container.on('click', '.del_exercise', function () {
        if ($('.exercise_total').text() == '1') {
            alert('题组应至少包含1题');
        } else {
            //重新处理题目序号
            var next = $(this).parents('div').eq(0).next();//获取下一题div
            while (next.hasClass('exercise_div')) {
                next.find('.exercise_num').text(parseInt(next.find('.exercise_num').text()) - 1);
                next = next.next();
            }
            $(this).parents('div').eq(0).remove();
            $('.exercise_total').text(parseInt($('.exercise_total').text()) - 1);
        }
    })

    //发布题组
    $('.publish').click(function () {
        var data = new Array();
        $('.exercise_div').each(function () {
            if (!$(this).hasClass('exercise_default')) {
                var content = {
                    num: $(this).find('.exercise_num').text(),
                    stem: $(this).find('.exercise_content').find('textarea').val(),
                    right_answer: $(this).find('.right_answer').attr('num')
                };
                var answer = new Array();
                $(this).find('.exercise_answer').each(function () {
                    if (!$(this).hasClass('choose_default')) {
                        answer.push($(this).find('input').val());
                    }
                })
                content['answer'] = answer;
                data.push(content);
            }
        })
        ajaxPost('text', '../Handler/handler.php?action=publish', {
            data: JSON.stringify(data),
            total: $('.exercise_total').text()
        }, function (msg) {
            console.log(msg);
            if (msg == 'ok') {
                alert('生成题组成功！');
            } else {
                alert(msg);
            }
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
