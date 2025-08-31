<?php
include "db.php";
header("Content-Type: application/json");

if (!isset($_GET["task_id"])) {
    http_response_code(400);
    echo json_encode(["error" => "task_id required"]);
    exit();
}
$task_id = (int)$_GET["task_id"];
$stmt = $conn->prepare("SELECT c.comment, c.created_at, u.username 
                        FROM comments c 
                        JOIN users u ON c.user_id=u.id 
                        WHERE c.task_id=? ORDER BY c.created_at DESC");
$stmt->bind_param("i", $task_id);
$stmt->execute();
$res = $stmt->get_result();
$out = [];
while ($row = $res->fetch_assoc()) $out[] = $row;
echo json_encode($out);
$stmt->close();
?>