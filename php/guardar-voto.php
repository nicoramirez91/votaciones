<?php 

include('conexion.php');

if(!isset($_POST['type'])) {
    die(json_encode(array('status' => 'error1')));
}

if ($_POST['type'] !== 'sendVot') {
    die(json_encode(array('status' => 'error2')));
}

$nombre    = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
$alias     = filter_var($_POST['alias'], FILTER_SANITIZE_STRING);
$rut       = filter_var($_POST['rut'], FILTER_SANITIZE_STRING);
$email     = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$region    = filter_var($_POST['region'], FILTER_SANITIZE_STRING);
$comuna    = filter_var($_POST['comuna'], FILTER_SANITIZE_STRING);
$candidato = filter_var($_POST['candidato'], FILTER_SANITIZE_STRING);
$enterar   = filter_var($_POST['enterar'], FILTER_SANITIZE_STRING);


$conn = new mysqli('localhost', $username, $password, $dbname);


if ($conn->connect_error) {
  die("La conexión a la base de datos falló: " . $conn->connect_error);
}

$sql = "SELECT * FROM votaciones WHERE rut = '$rut'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {

    die(json_encode(array('status' => 'rut_repeat')));
  } else {

    $sql = "INSERT INTO votaciones (nombre, alias, rut, email, region, comuna, candidato, enterar) 
            VALUES ('$nombre', '$alias', '$rut', '$email', '$region', '$comuna', '$candidato', '$enterar')";
  
    if ($conn->query($sql) === TRUE) {
        die(json_encode(array('status' => 'success')));
    } else {
        die(json_encode(array('status' => 'error3')));
    }
  }


$conn->close();





