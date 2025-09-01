<?php
include __DIR__ . '/../db.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['username'],$data['email'],$data['password'])) {
  http_response_code(400); echo json_encode(['error'=>'Missing fields']); exit();
}
$username = $data['username'];
$email = $data['email'];
$passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);
$role = (isset($data['role']) && $data['role']==='admin') ? 'admin' : 'member';

$stmt = $conn->prepare('INSERT INTO users (username,email,password,role) VALUES (?,?,?,?)');
$stmt->bind_param('ssss', $username, $email, $passwordHash, $role);
if ($stmt->execute()) {
  echo json_encode(['message'=>'Registered','user_id'=>$stmt->insert_id]);
} else {
  http_response_code(500); echo json_encode(['error'=>$conn->error]);
}
$stmt->close();
?>
