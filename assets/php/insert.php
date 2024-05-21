<?php

require_once('./config.php');

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if ($input) {
    $name = $input['name'];
    $cpf = $input['cpf'];
    $points = $input['points'];
    $award = $input['award'];

    $insert_query = "INSERT INTO user (name, cpf, points, award) VALUES ('$name', '$cpf', '$points', '$award')";
    $result_sql = mysqli_query($link, $insert_query);

    if ($result_sql) {
        $response_array['status'] = 'success';
        $response_array['query'] =  $insert_query;
    } else {
        $response_array['status'] = 'error';
        $response_array['message'] = 'Failed to insert data into the database';
    }

} else {
    $response_array['status'] = 'vazio';
}

header('Content-type: application/json');
echo json_encode($response_array);
?>
