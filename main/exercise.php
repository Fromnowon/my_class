<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>题目页</title>
    <link rel="stylesheet" href="../css/bootstrap.css">
    <link rel="stylesheet" href="../css/font-awesome.min.css">
    <link rel="stylesheet" href="../css/exercise.css">
    <script src="../js/jquery.min.js"></script>
    <script src="../js/bootstrap.js"></script>
    <script src="../js/exercise.js"></script>
</head>
<body code="<?php
if (isset($_GET['code'])) {
    echo $_GET['code'];
} else echo 'null';
?>" ip="<?php echo $_SERVER['REMOTE_ADDR']; ?>">
<div class="loading">
    <img src="../img/loading.gif" style="position: absolute;
               left:0;
               right: 0;
               top:0;
               bottom: 0;
               margin:auto;" alt="">
</div>
<div class="container">
    <div style="margin-top: 50px">
        <span class="title" style="font-size: 28px;font-weight: bold"></span>
        &nbsp;&nbsp;&nbsp;
        <div class="pull-right">
            <a href="javascript:void(0)" onclick="window.opener=null;window.close()" style="color: red">关闭页面</a>
        </div>
    </div>
    <br>
    <div class="exercise default hide e0">
        <div class="exercise_content">
            <span class="num">0</span>.<span class="stem">stem text</span>
        </div>
        <div class="answer_div">
            <table>
                <tr class="answer_tr answer_default">
                    <td>
                        <label><input style="margin-right: 10px" class="answer"
                                      type="radio"><span>answer text</span></label>
                    </td>
                </tr>
            </table>
        </div>
        <div class="attachment hide">
            <div>
                <hr>
                <p>附件：</p>
            </div>
            <div class="attachment_div">
            </div>
        </div>
    </div>
    <div class="insert_flag hide"></div>
    <div>
        <button class="btn btn-primary btn-large exercise_post hide" style="margin-top: 20px">提交</button>
    </div>

</div>
<div id="post_name" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
    <div class="modal-body">
        <div class="form-horizontal" style="padding-top: 10px">
            <label>
                请输入姓名：
                <input type="text" class="post_name_input" placeholder="如：2101张三">
            </label>
        </div>
        <span style="color: darkgray">名字将会用于成绩数据统计</span>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">取消</button>
        <button class="btn btn-primary post disable_btn" disabled="disabled">确认</button>
    </div>
</div>

<!--附件详情-->
<div class="attachment_detail_div">

</div>
</body>
</html>