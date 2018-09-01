<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/1
 * Time: 16:17
 */

$password='lbgz2012';//预设密码


$action = $_GET['action'];
switch ($action) {
    case 'validate':
        {
            $psw=$_POST['psw'];
            if ($psw==$password){
                session_start();
                $_SESSION['validate']=1;
                echo 'ok';
            }else echo 'wrong';
            break;
        }
    default:
        break;
}