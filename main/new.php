<?php
session_start();
if ($_SESSION['validate'] != 1) {
    echo '非法访问，请关闭此页';
    exit();
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>生成题组</title>
    <link rel="stylesheet" href="../css/bootstrap.css">
    <link rel="stylesheet" href="../css/new.css">
    <script src="../js/jquery.min.js"></script>
    <script src="../js/bootstrap.js"></script>
    <script src="../js/new.js"></script>
</head>
<body>
<div class="container">
    <div class="exercise">
        <table>
            <tr>
                <td style="width: 30px;text-align: center" valign="top" rowspan="2"><span class="exercise_num" >1</span>.</td>
                <td class="exercise_content">这是一道样例这是一道样例这是一道样例这是一道样例这是一道样例这是一道样例这是一道样例这是一道样例这是一道样例这是一道样例</td>
            </tr>
            <tr>
                <td class="exercise_choose" style="padding-top: 10px">


                </td>
            </tr>
        </table>
        <div>
            <br>
            <button class="btn btn-success"><i class="icon-plus icon-white"></i> 增加题目</button>
            <button class="btn btn-danger pull-right"><i class="icon-minus icon-white"></i> 删除此题</button>
        </div>
    </div>

</div>
</body>
</html>