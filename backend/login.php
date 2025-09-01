<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["email"], $data["password"])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit();
}

$email = $data["email"];
$password = $data["password"];

$stmt = $conn->prepare("SELECT id, username, password FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($id, $username, $hashed);
$stmt->fetch();
$stmt->close();

if ($id && password_verify($password, $hashed)) {
    echo json_encode(["message" => "Login successful", "user_id" => $id, "username" => $username]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
}
?>