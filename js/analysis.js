$(function () {
    //拉取题目数据
    ajaxPost('json', '../Handler/handler.php?action=pull', {code: $('body').attr('code')}, function (msg) {

    })

    var myChart = echarts.init(document.getElementsByClassName('result')[0]);
    //图表
    myChart.setOption({
        title: {
            text: '结果统计'
        },
        xAxis: {
            data: ["example", "example", "example"]
        },
        yAxis: {},
        series: [{
            type: 'bar',
            //data: [{value: 10, itemStyle: {color: 'green'}}, 20, 36, 10],
            data: [],
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
    var loading_flag = 1;
    //每3s拉取一次数据
    pull_analysis();//setInterval第一次执行也需要等待，故先执行一次
    setInterval(function () {
        pull_analysis();
    }, 3000);

    function pull_analysis() {
        ajaxPost('json', '../Handler/handler.php?action=analysis', {code: $('body').attr('code')}, function (msg) {
            console.log(msg['data']);
            if (loading_flag) myChart.hideLoading();
            loading_flag = 0;//避免重复调用hideLoading

            myChart.setOption({
                xAxis: {
                    data: ["答案1", "答案2", "答案3"]
                },
                series: [{
                    data: [{value: 10, itemStyle: {color: 'green'}}, 20, 36]
                }]
            });
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