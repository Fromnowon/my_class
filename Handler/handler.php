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
        break;
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
    add($conn, 'exercise', [$code, $_POST['total'], $_POST['title'], $_POST['data'], $date]);
    update($conn, 'total', 'count=count+1', 'id=1');
    echo 'ok';
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
    return $sql;
}

function delete($conn, $table, $where)
{
    $sql = "delete from `$table` where $where";
    $res = mysqli_query($conn, $sql);
    return $sql;
}

function update($conn, $table, $update, $where)
{
    $sql = "update `$table` set $update where $where";
    $res = mysqli_query($conn, $sql);
    return $sql;
}

//字符串转数组
function stringToArr($str)
{
    $arr = explode(',', $str);
    array_pop($arr);//弹出末尾逗号
    return $arr;
}

//弹出字符串数组中某元素，如：1,2,3,4,5,
function stringArrPop($str, $target)
{
    //校验
    if (inStringArr($str, $target)) {
        $arr = explode(',', $str);
        array_pop($arr);//弹出末尾逗号
        array_splice($arr, array_search($target, $arr), 1);
        if (count($arr) == 0) return '';
        else return implode(',', $arr) . ',';//勿遗漏末位逗号
    } else {
        //数组中不存在目标元素
        return -1;
    }

}

//在字符串数组中进行查找
function inStringArr($str, $target)
{
    $arr = explode(',', $str);
    return in_array($target, $arr);
}