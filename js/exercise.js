$(function () {
    ajaxPost('json', './Handler/handler.php?action=pull', {code: $('body').attr('code')}, function (msg) {
        $.each(msg, function (index, json) {
            var exercise = '';
            $.each(json, function (count, item) {
                //遍历题目数据
                switch (count) {
                    case 'id': {
                        exercise += "<div num='" + item + "'>" + item;
                        break;
                    }
                    case 'stem': {
                        exercise += "<div>" + item + "</div>";
                        break;
                    }
                    case 'answer': {
                        $.each(item, function (index, value) {
                            exercise += "<div>" + index + ' . ' + value + "</div>";
                        })
                        break;
                    }
                }
            })
            exercise += "</div>";
            $('.exercise').append(exercise);
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