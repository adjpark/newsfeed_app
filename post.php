<?php
    $servername = "";
    $username = "";
    $password = "";
    $dbname = "";

    try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
    catch(PDOException $e)
        {
            echo "Connection failed: " . $e->getMessage();
        }

    if($_POST["type"] == "upload"){
        $username = $_POST['username'];
        $avatar = $_POST['avatar'];
        $message = $_POST['message'];
        $country = $_POST['country'];

        $statement = $conn->prepare("INSERT INTO userPost (username, avatar, message, country) VALUES ('$username', '$avatar', '$message', '$country')");
        $statement->execute();
    }
    elseif($_POST["type"] == "download"){
        $statement = $conn->prepare("SELECT * FROM userPost");
        $statement->execute();
        $postRow = $statement->fetchAll(PDO::FETCH_ASSOC); 
        
        echo json_encode($postRow);
    }
?>