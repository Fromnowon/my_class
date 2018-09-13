$(function () {
    ajaxPost('json', '../Handler/handler.php?action=pull', {code: $('body').attr('code')}, function (msg) {
        $.each(msg, function (index, json) {
            $('.insert_flag').before($('.default').clone().removeClass('q0').addClass('q' + (parseInt(index) + 1)));
            var clone = $('.q' + (parseInt(index) + 1));
            //填充数据
            $.each(json, function (count, item) {
                switch (count) {
                    case 'id': {
                        //题号
                        clone.find('.num').text(parseInt(item));
                        break;
                    }
                    case 'stem': {
                        //题干
                        clone.find('.stem').text(item);
                        break;
                    }
                    case 'answer': {
                        // console.log(item);
                        // $.each(item, function (index_t, value) {
                        //     clone.find('.answer_div').find('table').append(clone.find('.answer_default').clone().removeClass('answer_default')).find('input').attr('name','a'+index_t).next().text(value);
                        // })
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