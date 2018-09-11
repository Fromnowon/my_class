<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/1
 * Time: 16:17
 */
include 'conn.php';
$password = 'lbgz2012';//预设密码


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
    default:
        break;
}
function pull($conn)
{
    $code = $_POST['code'];
    $result = all($conn, $code, '');
    for ($i = 0; $i < count($result); $i++) {
        $result[$i]['answer'] = json_decode($result[$i]['answer']);
    }
    echo json_encode($result);
}

function publish($conn)
{
    $data = json_decode($_POST['data'], true);//若无参数true则会被解析为对象，而非数组
    $num = (int)(select($conn, 'total', 'id=1')[0]['count']);
    $sql = "CREATE TABLE q" . $num . " 
(
id int NOT NULL AUTO_INCREMENT,
PRIMARY KEY(id),
stem text,
answer text,
right_answer varchar(6) DEFAULT NULL
)";
    mysqli_query($conn, $sql);//生成题组表
    foreach ($data as $exercise) {//向表中添加题目
        add($conn, 'q' . $num, [$exercise['stem'], json_encode($exercise['answer']), $exercise['right_answer']]);
    }
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
    if ($res && mysqli_affected_rows($conn) > 0) {
        return 'success';
    } else {
        return $sql;
    }
}

function delete($conn, $table, $where)
{
    $sql = "delete from `$table` where $where";
    $res = mysqli_query($conn, $sql);
    if ($res && mysqli_affected_rows($conn) > 0) {
        return 'success';
    } else {
        return $sql;
    }
}

function update($conn, $table, $update, $where)
{
    $sql = "update `$table` set $update where $where";
    $res = mysqli_query($conn, $sql);
    if ($res) {
        return 'success';
    } else {
        return $sql;
    }
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