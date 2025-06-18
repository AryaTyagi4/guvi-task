<?php
// php/redis_session.php
$redis = new Redis();
$redis->connect('redis', 6379);
$redis->auth(getenv('REDIS_PASSWORD'));
?>