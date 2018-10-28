$(function () {
    var files = {};
    var container = $('.container');

    //增加备选答案
    container.on('click', '.add_answer', function () {
        //限制答案数量
        if ($(this).parent().prev().attr('num') == '10') {
            alert('备选答案应不多于10个');
        }
        else {
            $(this).parent().prev().after($(this).parents('.exercise_choose').find('.choose_default').clone().removeClass('choose_default hide'));
            $(this).parent().prev().attr('num', parseInt($(this).parent().prev().prev().attr('num')) + 1);
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
            total: $('.exercise_total').text(),
            title: $('.title').val()
        }, function (msg) {
            console.log(msg);
            if (msg == 'ok') {
                alert('生成题组成功！');
            } else {
                alert(msg);
            }
        })
    })

    //上传文件
    $('.file_upload_btn').click(function () {
        $('#file_upload_input').trigger('click');
    })
    $('#file_upload_input').on('change', function () {
        //console.log($(this)[0].files);
        //限制文件数不大于5个
        if ($('.file_list').children().length >= 5) {
            alert('文件数应不大于5个');
            return;
        }

        $.each($(this)[0].files, function (index, element) {
            //存储文件对象
            if (files[element.name] == undefined) {
                //文件不存在
                files[element.name] = element;
            } else {
                alert('已存在同名文件！');
                return;
            }
            var img = new FileReader();
            img.readAsDataURL(element);
            img.onload = function (e) {
                var imgFile = e.target.result;
                //console.log(element);
                var file_list = $('.file_list');
                if (element.type.substr(0, element.type.indexOf('/')) == 'image') {
                    //若为图片则开启预览
                    file_list.prepend("<div class='file_div'><img src='" + imgFile + "' class='attachment_img'/><br><span style='font-size: 12px' class='file_name'>" + element.name + "</span><br><i class='fa fa-trash attachment_remove' style='margin-bottom: 5px'></i></div>");
                } else {
                    //若不为图片则使用默认图标
                    file_list.prepend("<div class='file_div'><img src='../img/file_default.png' class='attachment_img'/><br><span style='font-size: 12px' class='file_name'>" + element.name + "</span><br><i class='fa fa-trash attachment_remove' style='margin-bottom: 5px'></i></div>");
                }
                //绑定事件
                $('.attachment_remove').off().click(function () {
                    if (confirm('将删除此附件')) {
                        $(this).parent().remove();
                        delete files[$(this).parent().find('.file_name').html()];
                        file_list_show();
                    }
                })
                file_list_show();
            };
        });
        //console.log(files);
        $(this).val('');//解决选择相同文件时不触发事件的bug
    })
});

function file_list_show() {
    if ($('.file_list').children().length > 0)
        $('.file_list').removeClass('hide');
    else $('.file_list').addClass('hide');
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
