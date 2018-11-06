$(function () {
    var files = new Array({});
    var container = $('.main');
    var progress = new Array();

    //侧边工具栏尺寸
    set_toolbar();

    //导航栏数据填充
    nav_handler();

    function nav_handler() {
        var clone = $('.accordion-group.default').clone().removeClass('default hide');
        var num = $('.exercise_div').length - 1;
        var exercise = $('.exercise_div').eq(num);
        clone.attr('num', num);
        clone.find('.accordion-toggle').attr('href', '#collapse' + num).text('题目' + num);
        clone.find('.accordion-body').attr('id', 'collapse' + num).text('这里是小题详情');
        $('#accordion_nav').append(clone);
    }

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
        files.push({});
        //更新导航栏
        nav_handler();
    })

    //删除题目
    container.on('click', '.del_exercise', function () {
        if ($('.exercise_total').text() == '1') {
            alert('题组应至少包含1题');
        } else {
            //删除files数组数据
            files.splice(parseInt($(this).parents('.exercise_div').find('.exercise_num').text()) - 1, 1);
            //console.log(files);
            //重新处理题目序号
            var next = $(this).parents('.exercise_div').eq(0).next();//获取下一题div
            while (next.hasClass('exercise_div')) {
                next.find('.exercise_num').text(parseInt(next.find('.exercise_num').text()) - 1);
                next = next.next();
            }
            $('.exercise_total').text(parseInt($('.exercise_total').text()) - 1);
            nav_del(parseInt($(this).parents('.exercise_div').find('.exercise_num').text()));
            $(this).parents('.exercise_div').remove();
        }
    })

    function nav_del(num) {
        console.log(num);
        var item = $('.accordion-group').eq(num);//待删除元素
        item.fadeOut();
        while (item.next().hasClass('accordion-group')) {
            item.next().attr('num', num);
            item.next().find('.accordion-toggle').attr('href', '#collapse' + num).text('题目' + num);
            item.next().find('.accordion-body').attr('id', 'collapse' + num);
        }
        item.remove();
    }


    //发布题组
    $('.publish').click(function () {
        $('.progress').css({display: ''});
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
            //console.log(msg);
            if (!msg.error) {
                //alert('生成题组成功！');
                //完成上传文字信息
                //开始上传附件
                //生成标记数组
                var total = parseInt($('.exercise_total').text());
                for (var i = 0; i < total; i++)
                    progress.push(0);//为0时表示未完成
                progress.push(-1);//结束符
                var check = setInterval(function () {
                    //console.log(progress);
                    //轮询标记数组
                    for (var i in progress) {
                        if (progress[i] == 0) {
                            $('.progress_text').text(i + '/' + total);
                            return;//结束本次轮询
                        }
                        if (progress[i] == -1) {
                            $('.progress_text').text('完成！');
                            clearInterval(check);//都不为0.则结束轮询
                        }
                    }
                }, 500);
                var formdata_arr = new Array();
                for (var index_p in files) {
                    var formdata = new FormData();
                    for (var index in files[index_p]) {
                        formdata.append(index, files[index_p][index])
                    }
                    formdata_arr.push(formdata);
                }
                //console.log(files);
                upload_ajax(formdata_arr, 0);

                function upload_ajax(formdata, count) {
                    if (count > (total - 1)) return;
                    $.ajax(
                        {
                            url: '../Handler/handler.php?action=attachment_upload_' + msg,
                            type: "POST",
                            processData: false,
                            contentType: false,
                            data: formdata[count],
                            success: function (msg) {
                                //console.log(msg);
                                if (msg == 'ok') {
                                    progress[count] = 1;
                                    count++;
                                    upload_ajax(formdata, count);
                                } else {
                                    alert(msg);
                                    console.log(msg);
                                }
                            }
                        }
                    );
                }

            } else {
                alert(msg.data);
                console.log(msg);
            }
        })
    })


    //上传文件
    container.on('click', '.file_upload_btn', function () {
        $(this).parent().find('#file_upload_input').trigger('click');

    });
    container.on('change', '#file_upload_input', function () {
        //题号
        var num = parseInt($(this).parents('.exercise_div').find('.exercise_num').html()) - 1;
        // if (files.length <= num) {
        //     files.push({});
        //}
        //限制文件数不大于5个
        if ($(this).parent().find('.file_list').children().length >= 5) {
            alert('文件数应不大于5个');
            return;
        }

        var file_list = $(this).parent().find('.file_list');
        $.each($(this)[0].files, function (index, element) {
            //限制文件大小
            if (element.size > 10000000)
                alert('文件大于10M，将跳过部分文件！')
            else {
                // /存储文件对象
                if (files[num][element.name] == undefined) {
                    //文件不存在
                    files[num][element.name] = element;
                    var img = new FileReader();
                    img.readAsDataURL(element);
                    img.onload = function (e) {
                        var imgFile = e.target.result;
                        console.log(files);
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
                                delete files[num][$(this).parent().find('.file_name').html()];
                                file_list_show(file_list);
                            }
                        });
                        file_list_show(file_list);
                    };

                } else {
                    alert('已存在同名文件，将忽略部分文件！');
                }
            }
        });
        //console.log(files);
        $(this).val('');//解决选择相同文件时不触发事件的bug
    })
})
;
window.onresize = function () {
    set_toolbar();
}

function set_toolbar() {
    $('.nav_bar').css({
        width: $('.nav_bar').parent().width() - 20,
        top: 20
    })
}

function file_list_show(file_list) {
    if (file_list.children().length > 0)
        file_list.removeClass('hide');
    else file_list.addClass('hide');
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
