<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/1
 * Time: 16:17
 */
include 'conn.php';
$password = 'test';//预设密码

$action = $_GET['action'];
switch ($action) {
    case 'validate':
        {
            $psw = $_POST['psw'];
            if ($psw == $password) {
                session_start();
                $_SESSION['validate'] = 1;
                echo 'ok';
            } else echo 'wrong';
            break;
        }
    case 'publish':
        {
            publish($conn);
            break;
        }
    case 'pull':
        {
            pull($conn);
            break;
        }
    case 'post':
        {
            post($conn);
            break;
        }
    case 'analysis':
        {
            analysis($conn);
            break;
        }
    case 'history':
        {
            history($conn);
            break;
        }
    default:
        {
            if (substr($action, 0, 18) == 'attachment_upload_') {
                attachment_upload($conn, substr($action, 18));
            }
            break;
        }
}
function attachment_upload($conn, $code)
{

    $files = $_FILES;
    $attachment_arr = array();
    $result = 1;
    if (count($files) == 0) {
        //当前题目没有附件
        array_push($attachment_arr, array('empty' => 1));
    } else {
        $tmp_arr = array('empty' => 0);
        $count = 0;
        foreach ($files as $file) {
            $arr = explode(".", $file["name"]);
            $type = $arr[count($arr) - 1];//后缀名
            $file_name = md5(uniqid()) . '.' . $type;
            if (!move_uploaded_file($file["tmp_name"], "../userdata/" . $file_name))
                $result = 0;
            else $tmp_arr[$count] = array($file['name'] => $file_name);
            $count++;
        }
        array_push($attachment_arr, $tmp_arr);
    }

    if ($result) {
        $r = update($conn, 'exercise', "`attachment`='" . json_encode($attachment_arr) . "'", " `code`='{$code}'");
        if ($r == 'ok')
            echo 'ok';
        else echo $r;
    } else echo 'error while saving files';
}


function history($conn)
{
    //后台分页，每次只拉取n条记录
    $n = 5;
    $start = ($_POST['page'] - 1) * $n;
    $result = all($conn, 'exercise', "ORDER BY id DESC limit {$start},{$n}");
    if ($result[count($result) - 1]['id'] == 1) $result['flag'] = 'overflow';//溢出
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    mysqli_close($conn);
}

function analysis($conn)
{
    $code = $_POST['code'];
    $result = select($conn, 'answer', "code='{$code}'")[0];
    $data = json_decode($result['data']);
    $total = $result['total'];
    echo json_encode(array('total' => $total, 'data' => $data), JSON_UNESCAPED_UNICODE);
    mysqli_close($conn);
}

function post($conn)
{
    $data = json_decode($_POST['data'], true);
    $code = $data[0]['code'];//题组编号
    $name = $data[0]['name'];//提交用户姓名
    $ip = $data[0]['ip'];//用户ip
    //入库，以“题对人”的形式，免数组索引
    $result = select($conn, 'answer', "code='{$code}'")[0];
    if (count($result) == 0) {
        //无记录，则插入
        //格式化数据
        $answer_arr = array();
        foreach ($data[1] as $item) {
            array_push($answer_arr, [array('ip' => $ip, 'name' => $name, 'choose' => $item['choose'])]);
        }
        add($conn, 'answer', [$code, 1, json_encode($answer_arr, JSON_UNESCAPED_UNICODE)]);//填写参数防止中文转码
        echo 'ok';
    } else {
        //已有记录，进行更新
        $answer_arr_e = json_decode(select($conn, 'answer', "code='{$code}'")[0]['data']);
        foreach ($data[1] as $key => $value) {
            array_push($answer_arr_e[$key], array('ip' => $ip, 'name' => $name, 'choose' => $value['choose']));
        }
        update($conn, 'answer', "data='" . json_encode($answer_arr_e, JSON_UNESCAPED_UNICODE) . "',total=total+1", "code='{$code}'");
        echo 'ok';
    }
    mysqli_close($conn);
}

function pull($conn)
{
    $code = $_POST['code'];
    $r = select($conn, 'exercise', "code='{$code}'")[0];
    $result = [];
    array_push($result, $r['data']);
    array_push($result, $r['title']);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    mysqli_close($conn);
}

function publish($conn)
{
    $code = 'q' . select($conn, 'total', 'id=1')[0]['count'];
    $date = date('Y-m-d H:i:s');
    $r = add($conn, 'exercise', [$code, $_POST['total'], $_POST['title'], $_POST['data'], '', $date]);
    if ($r == 'ok') {
        echo $code;
        update($conn, 'total', 'count=count+1', 'id=1');
    } else echo 'error';
    mysqli_close($conn);
}

//--------------------PHP TOOL------------------------//
function select($conn, $table, $filter)
{
    //条件需手动拼凑成sql语句
    $sql = "select * from `$table` where $filter";
    $res = mysqli_query($conn, $sql);
    $arr = array();
    while ($row = mysqli_fetch_assoc($res)) {
        $arr[] = $row;
    }
    //注意，返回的结果为二维数组
    return $arr;
}

function all($conn, $table, $order)
{
    $sql = "select * from  `$table` " . $order;
    $res = mysqli_query($conn, $sql);
    $arr = array();
    while ($row = mysqli_fetch_assoc($res)) {
        $arr[] = $row;
    }
    return $arr;
}

function add($conn, $table, $arr)
{
    //arr需写成数组形式，且必须按顺序
    //mysqli_affected_rows返回最近一次sql操作影响的行数
    $str = array_values($arr);
    $str = implode("','", $str);
    $sql = "insert into `$table` values(DEFAULT ,'$str')";
    $res = mysqli_query($conn, $sql);
    if ($res) return 'ok';
    else return $sql;
}

function delete($conn, $table, $where)
{
    $sql = "delete from `$table` where $where";
    $res = mysqli_query($conn, $sql);
    if ($res) return 'ok';
    else return $sql;
}

function update($conn, $table, $update, $where)
{
    $sql = "update `$table` set $update where $where";
    $res = mysqli_query($conn, $sql);
    if ($res) return 'ok';
    else return $sql;
}