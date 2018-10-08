$(function () {
    //拉取题目数据
    ajaxPost('json', '../Handler/handler.php?action=pull', {code: $('body').attr('code')}, function (msg) {
        //拿到备选答案数量、标准答案

    })

    var myChart = echarts.init(document.getElementsByClassName('result')[0]);
    //图表
    myChart.setOption({
        title: {
            text: '结果统计'
        },
        xAxis: {
            data: ["答案1", "答案2", "答案3"]
        },
        yAxis: {},
        series: [{
            type: 'bar',
            //data: [{value: 10, itemStyle: {color: 'green'}}, 20, 36, 10],
            data: [0, 0, 0],//初始化时应决定数量
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
                        return '#0000ff';
                    }
                }
            },
            // 高亮样式。
            emphasis: {
                itemStyle: {
                    // 高亮时点的颜色。
                    color: '#000098'
                },
                label: {
                    show: true
                }
            }
        }]
    });
    myChart.showLoading();
    //每3s拉取一次数据
    pull_analysis(0);//setInterval第一次执行也需要等待，故先执行一次
    setInterval(function () {
        pull_analysis(0);
    }, 3000);

    function pull_analysis(number) {
        ajaxPost('json', '../Handler/handler.php?action=analysis', {code: $('body').attr('code')}, function (msg) {
            console.log(msg['data']);
            //填充数据
            var num = parseInt($('.result').attr('num'));//已统计的答案数
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
            $('.result').attr('num', num);
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