<?php
include "db.php";
header("Content-Type: application/json");

$statuses = ["To Do","In Progress","Completed"];
$stats = [];
foreach ($statuses as $s) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM tasks WHERE status=?");
    $stmt->bind_param("s", $s);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stats[$s] = (int)$count;
    $stmt->close();
}
echo json_encode($stats);
?>