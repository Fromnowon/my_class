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
<body code="<?php echo $_GET['code']; ?>">
<div class="container">
    <div class="exercise default hide q0">
        <div class="exercise_content">
            <span class="num">0</span>.<span class="stem">stem text</span>
        </div>
        <div class="answer_div">
            <table>
                <tr class="answer_tr answer_default">
                    <td>
                        <label><input style="margin-right: 10px" class="answer" type="radio"><span>answer text</span></label>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div class="insert_flag hide"></div>
</div>
</body>
</html>