<?php
include "db.php";
header("Content-Type: application/json");

$sql = "SELECT COALESCE(u.username,'Unassigned') AS username, COUNT(*) as task_count 
        FROM tasks t 
        LEFT JOIN users u ON t.assigned_to = u.id
        GROUP BY u.username";
$res = $conn->query($sql);
$out = [];
while ($row = $res->fetch_assoc()) $out[] = $row;
echo json_encode($out);
?>