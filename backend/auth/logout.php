<?php
include __DIR__ . '/../db.php';
session_unset(); session_destroy();
echo json_encode(['message'=>'Logged out']);
?>
