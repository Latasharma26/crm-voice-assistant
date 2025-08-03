<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$command = strtolower($data["command"] ?? "");

$conn = new mysqli("localhost", "root", "", "crm_db");

if ($conn->connect_error) {
    echo json_encode(["error" => "DB connection failed"]);
    exit();
}

if (strpos($command, "last progress note") !== false) {
    $user_id = 101;
    $sql = "SELECT note FROM progress_notes WHERE user_id = $user_id ORDER BY created_at DESC LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $row = $result->fetch_assoc()) {
        echo json_encode(["note" => $row["note"]]);
    } else {
        echo json_encode(["note" => "No note found."]);
    }
} else {
    echo json_encode(["note" => "Command not recognized."]);
}
