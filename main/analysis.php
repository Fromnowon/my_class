<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>结果分析页</title>
    <link rel="stylesheet" href="../css/bootstrap.css">
    <link rel="stylesheet" href="../css/font-awesome.min.css">
    <link rel="stylesheet" href="../css/analysis.css">
    <script src="../js/jquery.min.js"></script>
    <script src="../js/bootstrap.js"></script>
    <script src="../js/echarts.common.min.js"></script>
    <script src="../js/analysis.js"></script>
</head>
<body code="<?php
if (isset($_GET['code'])) {
    echo $_GET['code'];
} else echo 'null';
?>">
<div class="container">
    <div class="hide default">
        <div class="exercise_content">
        </div>
        <div class="result" style="width: 200px;height: 300px;" num="0"></div>
        <p class="no_data hide" style="color: red">暂无数据提交！</p>
        <hr>
    </div>
</div>
</body>
</html>