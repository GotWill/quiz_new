<?php

require_once ('./config.php');

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);


if ($input) {
    $cpf = $input['cpf'];

    $check_query = "SELECT * FROM user WHERE cpf = '$cpf'";
    $check_result = mysqli_query($link, $check_query);

    if (mysqli_num_rows($check_result) > 0) {
        $response_array['status'] = 'success';
        $response_array['message'] = 'CPF already exists in the database';
    }else {
        $response_array['status'] = 'error';
        $response_array['message'] = '';
    }
}else {
    $response_array['status'] = 'vazio';
}

header('Content-type: application/json');
echo json_encode($response_array);
?>