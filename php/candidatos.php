<?php
include('conexion.php');

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Error de conexión: " . $conn->connect_error);
}

$sql = "SELECT nombre FROM candidatos";
$resultado = $conn->query($sql);


if ($resultado->num_rows > 0) {
  $candidatos = array();
  while($fila = $resultado->fetch_assoc()) {
    array_push($candidatos, $fila["nombre"]);
  }

  echo json_encode($candidatos);
} else {
  echo "No se han encontrado registros.";
}


$conn->close();
?>