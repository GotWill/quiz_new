<?php

require_once ('./config.php');

$check_query = "SELECT * FROM user ORDER BY date desc LIMIT 5 ";
$check_result = mysqli_query($link, $check_query);

$response_array = array();

if ($check_result) {
    $response_array['status'] = 'success';
    $response_array['data'] = array();

    while ($row = mysqli_fetch_assoc($check_result)) {
        $response_array['users'][] = $row;
    }
} else {
    $response_array['status'] = 'error';
    $response_array['message'] = 'Failed to fetch data from the database';
}

// Define o cabeçalho como JSON
header('Content-type: application/json');

// Envia a resposta JSON
echo json_encode($response_array);

?>