<?php
$host = 'localhost';
$user = 'root';
$password = '';
$db = 'salon_agenda'; 


$conn = new mysqli($host, $user, $password, $db);


if ($conn->connect_error) {
  die("Falha na conexão: " . $conn->connect_error);
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
 
  $result = $conn->query("SELECT * FROM agendamentos");


  if ($result->num_rows > 0) {
 
    $agendamentos = $result->fetch_all(MYSQLI_ASSOC);

 
    echo json_encode($agendamentos);
  } else {
 
    echo json_encode([]);
  }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $data = json_decode(file_get_contents("php://input"), true);


  if (isset($data['cliente'], $data['data_hora'], $data['servico'])) {
    $cliente = $data['cliente'];
    $dataHora = $data['data_hora'];
    $servico = $data['servico'];

   
    $stmt = $conn->prepare("INSERT INTO agendamentos (cliente, data_hora, servico) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $cliente, $dataHora, $servico);

   
    if ($stmt->execute()) {
      echo json_encode(["success" => true]);
    } else {
      echo json_encode(["success" => false]);
    }

  
    $stmt->close();
  } else {
   
    echo json_encode(["success" => false]);
  }
}


if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  parse_str(file_get_contents("php://input"), $data);

  
  if (isset($data['id'])) {
    $id = $data['id'];

   
    $stmt = $conn->prepare("DELETE FROM agendamentos WHERE id = ?");
    $stmt->bind_param("i", $id);

    
    if ($stmt->execute()) {
      echo json_encode(["success" => true]);
    } else {
      echo json_encode(["success" => false]);
    }

    
    $stmt->close();
  }
}

$conn->close();
