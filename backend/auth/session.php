<?php
include __DIR__ . '/../db.php';
header('Content-Type: application/json');
if (isset($_SESSION['user_id'])) {
  echo json_encode(['user'=>['id'=>$_SESSION['user_id'],'username'=>$_SESSION['username'],'role'=>$_SESSION['role']]]);
} else {
  echo json_encode(['user'=>null]);
}
?>
