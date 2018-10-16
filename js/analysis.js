$(function () {
    //拉取题目数据
    ajaxPost('json', '../Handler/handler.php?action=pull', {code: $('body').attr('code')}, function (msg) {
        //console.log(JSON.parse(msg[0]));
        $.each(JSON.parse(msg[0]), function (index, element) {
            //console.log(element);
            attach_data(index, element);
        })

    });

    function attach_data(index, msg) {//填充数据
        var answer_num = msg['answer'].length;//备选答案数量
        var right_answer = msg['right_answer'];//若为undefined则为无标准答案
        var append = $('.default').after($('.default').clone()).removeClass('hide default').addClass('q' + msg.num);
        append.find('.result').css({width: answer_num * 100});//调整宽度
        var myChart = echarts.init(append.find('.result')[0]);
        append.find('.exercise_content').append("<p style='font-weight: bold'>" + msg.num + "." + msg.stem + "</p>");
        for (var val in msg.answer) {
            append.find('.exercise_content').append("<p>答案" + (parseInt(val) + 1) + '：' + msg.answer[val] + "</p>");
        }

        //图表初始化
        var x_init = new Array();
        for (var i = 0; i < answer_num; i++) {
            x_init[i] = '答案' + (i + 1);
        }
        var data_init = new Array();
        for (var i = 0; i < answer_num; i++) {
            data_init[i] = 0;
        }
        myChart.setOption({
            title: {
                text: '结果统计'
            },
            xAxis: {
                data: x_init
            },
            yAxis: {},
            series: [{
                type: 'bar',
                barWidth: 50,
                //data: [{value: 10, itemStyle: {color: 'green'}}, 20, 36, 10],
                data: data_init,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                fontWeight: 'bolder',
                                fontSize: '12',
                                color: 'black'
                            },
                            position: 'top'
                        },
                        color: function (params) {
                            //根据数据动态返回颜色
                            if (params.dataIndex == right_answer) return '#2dd31d';//若为标准答案则以绿色标记
                            return '#2090eb';
                        }
                    }
                },
                // 高亮样式。
                emphasis: {
                    itemStyle: {
                        // 高亮时点的颜色。
                        color: '#0000c5'
                    },
                    label: {
                        show: true
                    }
                }
            }]
        });
        myChart.showLoading();

        //每3s拉取一次数据
        pull_analysis(myChart, index, append);//setInterval第一次执行也需要等待，故先执行一次
        setInterval(function () {
            pull_analysis(myChart, index, append);
        }, 3000);
    }

    function pull_analysis(myChart, number, obj) {
        ajaxPost('json', '../Handler/handler.php?action=analysis', {code: $('body').attr('code')}, function (msg) {
            //填充数据
            if (msg['total'] == null) return;
            var num = parseInt(obj.find('.result').attr('num'));//已统计的答案数
            var flag = 0;//更新标记
            var data = myChart.getOption().series[0].data;//获取旧数据
            while (num < msg['data'][number].length) {
                flag = 1;
                data[msg['data'][number][num]['choose']]++;//统计数+1
                num++;
            }
            if (flag) {
                myChart.setOption({
                    series: [{
                        data: data
                    }]
                });
                myChart.hideLoading();
            }
            obj.find('.result').attr('num', num);
        })
    }
});

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
            //alert('error');
            console.log('error:' + msg);
        }
    });
}