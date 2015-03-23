<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE');
header('Access-Control-Allow-Credentials', false);
header('Access-Control-Max-Age', '86400');
header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

// comment out the following two lines when deployed to production
defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'dev');

require(__DIR__ . '/../vendor/autoload.php');
require(__DIR__ . '/../vendor/yiisoft/yii2/Yii.php');

$config = require(__DIR__ . '/../config/web.php');

$app = new yii\web\Application($config);

//if (!isset($_COOKIE['grbh_vid']) || $_COOKIE['grbh_vid'] == null) {
//
//    setcookie('grbh_vid', str_replace('.', '', microtime(true)), time() + 86400 * 365, '/');
//}


$app->run();