<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>题目发布</title>
    <link rel="stylesheet" href="css/bootstrap.css">
    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.js"></script>
    <script src="js/index.js"></script>
    <style>
        .history_body table {
            width: 100%;
        }

        .history_body td, .history_body th {
            text-align: center;
            vertical-align: middle;
        }
    </style>
</head>
<body>
<div class="container" style="padding-top: 15%">
    <div class="text-center">
        <button class="btn btn-primary btn-large new">发布题组</button>
    </div>
    <br><br>
    <div class="text-center"><a href="javascript:void(0)" class="history_btn">历史记录</a></div>
</div>
<div id="psw" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="myModalLabel">权限验证</h3>
    </div>
    <div class="modal-body">
        <input type="password" class="input-large psw_input" style="height:30px;font-size: 30px">
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
        <button class="btn btn-primary" disabled>确认</button>
    </div>
</div>
<div id="history" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="myModalLabel">历史记录：</h3>
    </div>
    <div class="modal-body history_body">
        <table>
            <tr>
                <td>加载中...</td>
            </tr>
        </table>
        <div style="text-align: center;font-size: 18px" class="page_btn hide">
            <div class="form-horizontal pull-right">
                <a href="#">上一页</a>
                &nbsp;
                <a href="#">下一页</a>
                &nbsp;&nbsp;&nbsp;
                <input type="text" style="width: 30px">
                <button class="btn">跳转</button>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
    </div>
</div>
</body>
</html>