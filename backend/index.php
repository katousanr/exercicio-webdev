<?php
//header('Content-Type: application/json');

require_once "WorldCup/index.php";

function getPUT()
{
    // Fetch content and determine boundary
    $raw_data = file_get_contents('php://input');
    $boundary = substr($raw_data, 0, strpos($raw_data, "\r\n"));

// Fetch each part
    $parts = array_slice(explode($boundary, $raw_data), 1);
    $data = array();

    foreach ($parts as $part) {
        // If this is the last part, break
        if ($part == "--\r\n") break;

        // Separate content from headers
        $part = ltrim($part, "\r\n");
        list($raw_headers, $body) = explode("\r\n\r\n", $part, 2);

        // Parse the headers list
        $raw_headers = explode("\r\n", $raw_headers);
        $headers = array();
        foreach ($raw_headers as $header) {
            list($name, $value) = explode(':', $header);
            $headers[strtolower($name)] = ltrim($value, ' ');
        }

        // Parse the Content-Disposition to get the field name, etc.
        if (isset($headers['content-disposition'])) {
            $filename = null;
            preg_match(
                '/^(.+); *name="([^"]+)"(; *filename="([^"]+)")?/',
                $headers['content-disposition'],
                $matches
            );
            list(, $type, $name) = $matches;
            isset($matches[4]) and $filename = $matches[4];

            // handle your fields here
            switch ($name) {
                // this is a file upload
                case 'userfile':
                    file_put_contents($filename, $body);
                    break;

                // default for all other files is to populate $data
                default:
                    $data[$name] = substr($body, 0, strlen($body) - 2);
                    break;
            }
        }

    }
    return $data;
}


if($_SERVER['REQUEST_METHOD'] === "GET")
{
    $result = "";
    if(!isset($_GET['nome']))
        $result = dataBase::getDB()->pegarTodas();
    else
        $result = dataBase::getDB()->procurar($_GET['nome']);


    $corpo = array();
    foreach($result as $item){
        array_push($corpo,$item->toJson());
    }
    $error = array("code" => 0,"msg" => "");
    echo json_encode(array("error"=> $error,"content" => $corpo ) );
}
if($_SERVER['REQUEST_METHOD'] === "POST")
{
    if(!isset($_POST['nome']) or !isset($_POST['grupo']) or !isset($_POST['continente']))
        throw new WCException("Argumento invalido",9);

    $s = new selecao();
    $s->setNome( $_POST['nome']);
    $s->setContinente($_POST['continente']);
    $s->setGrupo($_POST['grupo']);
    $result = dataBase::getDB()->criarSelecao($s);

    $error = array("code" => 0,"msg" => "");
    echo json_encode(array("error"=> $error,"content" => array($result->toJson())) );
}
if($_SERVER['REQUEST_METHOD'] === "DELETE")
{
    if(!isset($_GET['id']))
        throw new WCException("Argumento invalido",9);

    dataBase::getDB()->DeletarSelecao($_GET['id']);

    $error = array("code" => 0,"msg" => "");
    echo json_encode(array("error"=> $error,"content" => null) );
}
if($_SERVER['REQUEST_METHOD'] === "PUT")
{
    $putfp = getPUT();
    $s = new class extends selecao
    {
        public function setid(int $id)
        {
            $this->idselecao = $id;
        }
    };
    $s->setid($putfp['idselecao']);
    $s->setNome( $putfp['nome']);
    $s->setContinente($putfp['continente']);
    $s->setGrupo($putfp['grupo']);
    dataBase::getDB()->alterarSelecao($s);

    $error = array("code" => 0,"msg" => "");
    echo json_encode(array("error"=> $error,"content" => null));
}


//echo json_encode(['status' => 'OK']);