<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["username"], $data["email"], $data["password"])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit();
}

$username = $data["username"];
$email = $data["email"];
$password = password_hash($data["password"], PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $password);
if ($stmt->execute()) {
    echo json_encode(["message" => "User registered"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Registration failed: " . $conn->error]);
}
$stmt->close();
?>