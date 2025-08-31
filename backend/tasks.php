<?php
include "db.php";
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $sql = "SELECT t.id, t.title, t.description, t.status, COALESCE(u.username, '') AS assigned_to
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.id
            ORDER BY t.id DESC";
    $result = $conn->query($sql);

    $tasks = [];
    while ($row = $result->fetch_assoc()) {
        $task_id = (int)$row["id"];
        $comments_stmt = $conn->prepare("SELECT c.comment, c.created_at, u.username 
                         FROM comments c 
                         JOIN users u ON c.user_id=u.id
                         WHERE c.task_id = ?
                         ORDER BY c.created_at DESC");
        $comments_stmt->bind_param("i", $task_id);
        $comments_stmt->execute();
        $cres = $comments_stmt->get_result();
        $comments = [];
        while ($c = $cres->fetch_assoc()) {
            $comments[] = $c;
        }
        $row["comments"] = $comments;
        $tasks[] = $row;
        $comments_stmt->close();
    }

    echo json_encode($tasks);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data["title"]) || !isset($data["description"])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing fields"]);
        exit();
    }
    $title = $data["title"];
    $description = $data["description"];
    $status = isset($data["status"]) ? $data["status"] : "To Do";
    $assigned_to = isset($data["assigned_to"]) ? (int)$data["assigned_to"] : null;

    $stmt = $conn->prepare("INSERT INTO tasks (title, description, status, assigned_to) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $title, $description, $status, $assigned_to);
    if ($stmt->execute()) {
        echo json_encode(["message" => "Task created", "id" => $stmt->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to create task"]);
    }
    $stmt->close();
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
?>