<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>随堂检测发布</title>
    <link rel="stylesheet" href="css/bootstrap.css">
    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.js"></script>
    <script src="js/index.js"></script>
</head>
<body>
<div class="container" style="padding-top: 15%">
    <div class="text-center"><button class="btn btn-primary btn-large new">发布题组</button></div>
    <br><br>
    <div class="text-center"><a href="#">历史记录</a></div>
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
        <button class="btn btn-primary">确认</button>
    </div>
</div>
</body>
</html>