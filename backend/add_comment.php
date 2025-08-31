<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["task_id"], $data["user_id"], $data["comment"])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit();
}

$task_id = (int)$data["task_id"];
$user_id = (int)$data["user_id"];
$comment = $data["comment"];

$stmt = $conn->prepare("INSERT INTO comments (task_id, user_id, comment) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $task_id, $user_id, $comment);
if ($stmt->execute()) {
    echo json_encode(["message" => "Comment added"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to add comment"]);
}
$stmt->close();
?>