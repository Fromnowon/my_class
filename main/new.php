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
    <link rel="stylesheet" href="../css/font-awesome.min.css">
    <link rel="stylesheet" href="../css/new.css">
    <script src="../js/jquery.min.js"></script>
    <script src="../js/bootstrap.js"></script>

    <script src="../js/new.js"></script>
</head>
<body>
<div class="progress" style="display: none">
    <div style="display: table-cell;width: 100%;height: 100%;vertical-align: middle;text-align: center">
        <p style="font-size: 20px">数据上传中...<span class="progress_text">n/N</span></p>
    </div>
</div>
<div class="container-fluid">
    <div class="row-fluid">
        <div class="span2">
            <div class="bar_header" style="position: fixed;margin-top: 20px">
                <p style="font-weight: bold;">题数：
                    <span class="exercise_total" style="color: green">1</span>
                    <i class="fa fa-arrow-down pull-right" style="margin-top: 3px;cursor: pointer" title="列表向上滚动"></i>
                    <i class="fa fa-arrow-up pull-right" style="margin-right: 10px;margin-top: 3px;cursor: pointer"
                       title="列表向下滚动"></i>
                </p>

            </div>
            <div class="nav_bar">
                <div>
                    <div class="accordion" id="accordion_nav">
                        <!--添加折叠栏-->
                        <div class="accordion-group default hide" num="0">
                            <div class="accordion-heading">
                                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion_nav"
                                   href="#collapse0">
                                    content0
                                </a>

                            </div>
                            <div id="collapse0" class="accordion-body collapse">
                                <div class="accordion-inner">
                                    content0
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="span10">
            <div class="main">
                <div style="margin-top: 20px">
                    <span style="font-size: 26px">题组名称：</span>
                    <input type="text" class="title">
                    <br>
                </div>
                <div class="exercise">
                    <div class="exercise_default exercise_div" style="display:none;margin-bottom:20px;padding: 10px">
                        <table>
                            <tr>
                                <td colspan="2" height="30px"><a href="javascript:void(0)"
                                                                 class="pull-right del_exercise"><i
                                                style="transform: scale(1.1);" class="icon-remove"></i></a></td>
                            </tr>
                            <tr>
                                <td style="width: 30px;text-align: center" valign="top" rowspan="2"><span
                                            class="exercise_num" value="0">0</span>.
                                </td>
                                <td class="exercise_content"><textarea
                                            style="margin-left: 20px;width: 90%;height: 80px"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td class="exercise_choose" style="padding-top: 10px">
                                    <div class="exercise_answer choose_default hide" style="position: relative;">
                                        <input class="answer" style="margin-left: 20px;width: 400px;" type="text"
                                               placeholder="备选答案">
                                        <a href="javascript:void(0)" class="del_answer"><i
                                                    style="position: absolute;left: 480px;top:8px;color: #d50000"
                                                    class="fa fa-minus"></i></a>
                                        <a href="javascript:void(0)" title="设为标准答案" class="set_right_answer"><i
                                                    style="color:#cbcbcb;position: absolute;left: 450px;top:6px"
                                                    class="fa fa-check"></i></a>
                                    </div>
                                    <div class="exercise_answer" style="position: relative;" num="0">
                                        <input class="answer" style="margin-left: 20px;width: 400px" type="text"
                                               placeholder="备选答案">
                                        <a href="javascript:void(0)" title="设为标准答案" class="set_right_answer"><i
                                                    style="color:#cbcbcb;position: absolute;left: 450px;top:6px"
                                                    class="fa fa-check"></i></a>
                                    </div>
                                    <div class="exercise_answer" style="position: relative;" num="1">
                                        <input class="answer" style="margin-left: 20px;width: 400px" type="text"
                                               placeholder="备选答案">
                                        <a href="javascript:void(0)" title="设为标准答案" class="set_right_answer"><i
                                                    style="color:#cbcbcb;position: absolute;left: 450px;top:6px"
                                                    class="fa fa-check"></i></a>
                                    </div>
                                    <div>
                                        <a href="javascript:void(0)" class="add_answer"><i
                                                    style="transform: scale(1.2);margin-left: 20px;"
                                                    class="icon-plus"></i></a>
                                    </div>
                                    <p style="margin: 10px 20px;font-size: 14px">附件：</p>
                                    <div class="attachment">
                                        <!--可添加图片、文档等附件-->
                                        <div class="file_list hide">
                                            <!--文件列表区，暂不提供内容预览-->
                                        </div>
                                        <input class="span2" id="file_upload_input" type="file" name="file[]" multiple
                                               style="display: none">
                                        <button class="btn btn-default file_upload_btn">选择文件</button>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div style="margin-top:20px;height:10px;border-bottom:1px solid darkgray"></div>
                    </div>
                    <div class="exercise_div" style="margin-bottom:20px;padding: 10px">
                        <table>
                            <tr>
                                <td colspan="2" height="30px">
                                    <a href="javascript:void(0)" class="pull-right del_exercise">
                                        <i style="transform: scale(1.1)" class="icon-remove"></i></a></td>
                            </tr>
                            <tr>
                                <td style="width: 30px;text-align: center" valign="top" rowspan="2"><span
                                            class="exercise_num" value="1">1</span>.
                                </td>
                                <td class="exercise_content">
                                    <textarea style="margin-left: 20px;width: 90%;height: 80px"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td class="exercise_choose" style="padding-top: 10px">
                                    <div class="exercise_answer choose_default hide" style="position: relative;">
                                        <input class="answer" style="margin-left: 20px;width: 400px;" type="text"
                                               placeholder="备选答案">
                                        <a href="javascript:void(0)" class="del_answer"><i
                                                    style="position: absolute;left: 480px;top:8px;color: #d50000"
                                                    class="fa fa-minus"></i></a>
                                        <a href="javascript:void(0)" title="设为标准答案" class="set_right_answer"><i
                                                    style="color:#cbcbcb;position: absolute;left: 450px;top:6px"
                                                    class="fa fa-check"></i></a>
                                    </div>
                                    <div class="exercise_answer" style="position: relative;" num="0">
                                        <input class="answer" style="margin-left: 20px;width: 400px" type="text"
                                               placeholder="备选答案">
                                        <a href="javascript:void(0)" title="设为标准答案" class="set_right_answer"><i
                                                    style="color:#cbcbcb;position: absolute;left: 450px;top:6px"
                                                    class="fa fa-check"></i></a>
                                    </div>
                                    <div class="exercise_answer" style="position: relative;" num="1">
                                        <input class="answer" style="margin-left: 20px;width: 400px" type="text"
                                               placeholder="备选答案">
                                        <a href="javascript:void(0)" title="设为标准答案" class="set_right_answer"><i
                                                    style="color:#cbcbcb;position: absolute;left: 450px;top:6px"
                                                    class="fa fa-check"></i></a>
                                    </div>
                                    <div>
                                        <a href="javascript:void(0)" class="add_answer"><i
                                                    style="transform: scale(1.2);margin-left: 20px;"
                                                    class="icon-plus"></i></a>
                                    </div>
                                    <p style="margin: 10px 20px;font-size: 14px">附件：</p>
                                    <div class="attachment">
                                        <!--可添加图片、文档等附件-->
                                        <div class="file_list hide">
                                            <!--文件列表区，暂不提供内容预览-->
                                        </div>
                                        <input class="span2" id="file_upload_input" type="file" name="file[]" multiple
                                               style="display: none">
                                        <button class="btn btn-default file_upload_btn">选择文件</button>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div style="margin-top:20px;height:10px;border-bottom:1px solid darkgray"></div>
                    </div>
                    <div class="insert_flag"></div>
                </div>
            </div>
            <div>
                <button class="btn btn-success add_exercise"><i class="icon-plus icon-white"></i> 增加题目</button>
                <br>
                <button class="btn btn-primary btn-large publish pull-right">确认发布</button>
            </div>
        </div>
    </div>
</div>
<br><br>
</body>
</html>