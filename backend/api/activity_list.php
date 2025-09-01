<?php
include __DIR__ . '/../db.php';
header('Content-Type: application/json');
$res = $conn->query('SELECT a.id,a.action,a.created_at,u.username FROM activity_log a JOIN users u ON a.user_id=u.id ORDER BY a.created_at DESC LIMIT 200');
$out = []; while ($r = $res->fetch_assoc()) $out[] = $r;
echo json_encode($out);
?>
