<?php
/**
 * Created by PhpStorm.
 * User: rafael
 * Date: 06/07/18
 * Time: 20:05
 */
require_once "configure.php";
require_once "selecao.php";
require_once "WordCupException.php";

class dataBase
{
    protected $conn;

    /**
     * @var dataBase
     */
    private static $instance = null;

    /**
     * @return dataBase
     * @throws WCException
     */
    public static function getDB() : dataBase
    {
        if(dataBase::$instance == null)
            dataBase::$instance = new dataBase();

        return dataBase::$instance;
    }

    /**
     * dataBase constructor.
     * @throws WCException
     */
    private function __construct()
    {
        $this->conn = new mysqli(DB_IP,DB_USR,DB_PASS,DB_NAME,DB_PORT);

        if($this->conn->connect_errno)
            throw new WCException("Falha de conexão: ".$this->conn->connect_error, 3);
    }


    /**
     * @param selecao $selecao
     * @return selecao
     * @throws WCException
     */
    public function criarSelecao(selecao $selecao) : selecao
    {

        $result = $this->conn->query("SELECT * FROM selecao");
        $result = $result->num_rows;

        if($result >= 32)
            throw new WCException("Falha ao cadastrar seleção numero maximo atingido", 2);

        $sttm = $this->conn->prepare("INSERT INTO selecao(nome,grupo,continente) VALUES (?,?,?)");
        $nome = $selecao->getNome();
        $grupo = $selecao->getGrupo();
        $continete = $selecao->getContinente();

        $sttm->bind_param("sss",$nome,$grupo,$continete);
        $sttm->execute();

        if($sttm->errno)
        {
            if($sttm->errno == 1062)
                throw new WCException("falha ao dacastrar seleção : Seleção ja cadastrada");

            if($sttm->errno == 1048)
                throw new WCException("falha ao cadastrar seleção campo vazio ou invalido");
        }

        $result = $this->conn->query("SELECT * FROM selecao WHERE idselecao = LAST_INSERT_ID();");
        $result = $result->fetch_array(MYSQLI_ASSOC);

        $retorno =  new class extends selecao {
            public function setId(int $id)
            {
                $this->idselecao = $id;
            }
        };

        $retorno->setId($result["idselecao"]);
        $retorno->setNome($result['nome']);
        $retorno->setGrupo($result['grupo']);
        $retorno->setContinente($result['continente']);
        return $retorno;
    }

    /**
     * @param selecao $selecao
     * @throws WCException
     */
    public function alterarSelecao(selecao $selecao)
    {
        $sttm = $this->conn->prepare("UPDATE selecao SET nome = ?,grupo = ?,continente = ? WHERE idselecao = ? ");
        $sttm->bind_param("sssi",$selecao->getNome(),$selecao->getGrupo(),$selecao->getContinente(),$selecao->getId() );
        $sttm->execute();

        if($sttm->errno)
            throw new WCException("Erro Falha ao alterar dados",4);
    }

    /**
     * @param int $selecao
     * @throws WCException
     */
    public function DeletarSelecao(int $selecao)
    {
        $result = $this->conn->query("DELETE FROM selecao WHERE idselecao = ".$selecao);

        if($this->conn->errno)
            throw new WCException("Falha ao deletar pais, id Invalida",5);
    }

    public function pegarTodas()
    {
        $retorno = array();
        $result = $this->conn->query("SELECT * FROM selecao");
        foreach ($result->fetch_all(MYSQLI_ASSOC) as $item)
            array_push($retorno,$this->MysqliResultToSelecao($item));

        return $retorno;
    }
    /**
     * @param string $
     * @return array
     * @throws WCException
     * @throws Exception
     */
    public function procurar(string $nome)
    {
        $parametro = "%".$nome."%";
        $sttm = $this->conn->prepare("SELECT * FROM selecao WHERE nome LIKE ?");
        $sttm->bind_param("s", $parametro);
        $sttm->execute();
        $retorno = array();
        if($sttm->errno)
            throw new WCException("Falha ao procurar selecao",6);

        $result = $sttm->get_result();
        foreach ($result->fetch_all(MYSQLI_ASSOC) as $item)
            array_push($retorno,$this->MysqliResultToSelecao($item));

        return $retorno;
    }

    /**
     * @return selecao
     * @throws Exception
     */
    private function MysqliResultToSelecao($mysqlResult) : selecao
    {
        $retorno = new class extends selecao
        {
            /**
             * @param int $idselecao
             */
            public function setIdselecao(int $idselecao): void
            {
                $this->idselecao = $idselecao;
            }
        };
        $retorno->setIdselecao($mysqlResult["idselecao"]);
        $retorno->setGrupo($mysqlResult["grupo"]);
        $retorno->setContinente($mysqlResult["continente"]);
        $retorno->setNome($mysqlResult["nome"]);
        return $retorno;
    }

    public function __destruct()
    {
        $this->conn->close();
    }
    public function close()
    {
        $this->conn->close();
        dataBase::$instance = null;
    }
}

