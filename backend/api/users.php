<?php
include __DIR__ . '/../db.php';
header('Content-Type: application/json');
$res = $conn->query('SELECT id,username,email,role FROM users ORDER BY username ASC');
$out = []; while ($r = $res->fetch_assoc()) $out[] = $r;
echo json_encode($out);
?>
