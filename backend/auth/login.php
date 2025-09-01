<?php
include __DIR__ . '/../db.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['email'],$data['password'])) { http_response_code(400); echo json_encode(['error'=>'Missing']); exit(); }
$email = $data['email']; $password = $data['password'];

$stmt = $conn->prepare('SELECT id, username, password, role FROM users WHERE email=?');
$stmt->bind_param('s',$email);
$stmt->execute();
$stmt->bind_result($id,$username,$hash,$role);
$found = false;
if ($stmt->fetch()) $found = true;
$stmt->close();

if (!$found || !password_verify($password,$hash)) { http_response_code(401); echo json_encode(['error'=>'Invalid credentials']); exit(); }

$_SESSION['user_id'] = $id;
$_SESSION['username'] = $username;
$_SESSION['role'] = $role;
echo json_encode(['message'=>'Login successful','user'=>['id'=>$id,'username'=>$username,'role'=>$role]]);
?>
