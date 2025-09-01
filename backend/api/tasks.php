<?php
include __DIR__ . '/../db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $sql = "SELECT t.id,t.title,t.description,t.status,t.assigned_to, COALESCE(u.username,'') AS assigned_name, t.created_at
          FROM tasks t LEFT JOIN users u ON t.assigned_to=u.id
          ORDER BY t.id DESC";
  $res = $conn->query($sql);
  $out = [];
  while ($row = $res->fetch_assoc()) {
    $task_id = (int)$row['id'];
    $cstmt = $conn->prepare('SELECT c.comment, c.created_at, u.username FROM comments c JOIN users u ON c.user_id=u.id WHERE c.task_id=? ORDER BY c.created_at DESC');
    $cstmt->bind_param('i',$task_id);
    $cstmt->execute();
    $cres = $cstmt->get_result();
    $comments = [];
    while ($c = $cres->fetch_assoc()) $comments[] = $c;
    $row['comments'] = $comments;
    $out[] = $row;
    $cstmt->close();
  }
  echo json_encode($out);
  exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);
  if (!isset($data['title'])) { http_response_code(400); echo json_encode(['error'=>'Title required']); exit(); }
  $title = $data['title'];
  $desc = $data['description'] ?? '';
  $status = $data['status'] ?? 'To Do';
  $assigned = isset($data['assigned_to']) ? (int)$data['assigned_to'] : null;

  $stmt = $conn->prepare('INSERT INTO tasks (title,description,status,assigned_to) VALUES (?,?,?,?)');
  $stmt->bind_param('sssi',$title,$desc,$status,$assigned);
  if ($stmt->execute()) { echo json_encode(['message'=>'Task created','id'=>$stmt->insert_id]); }
  else { http_response_code(500); echo json_encode(['error'=>'Create failed']); }
  $stmt->close();
  exit();
}

http_response_code(405); echo json_encode(['error'=>'Method not allowed']);
?>
