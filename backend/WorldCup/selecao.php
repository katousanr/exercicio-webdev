<?php
/**
 * Created by PhpStorm.
 * User: rafael
 * Date: 06/07/18
 * Time: 19:51
 */

class selecao
{
    protected $continente;
    /**
     * @var string
     */
    protected $nome;

    /**
     * @var string
     */
    protected $grupo;

    /**
     * @var integer
     */
    protected $idselecao;

    /**
     * @param string $nome
     */
    public function setNome(string $nome): void
    {
        $this->nome = $nome;
    }
    /**
     * @param mixed $continente
     */public function setContinente($continente): void
    {
        $this->continente = $continente;
    }

    /**
     * @param string $grupo
     * @throws WCexception
     */
    public function setGrupo(string $grupo): void
    {
        if(strlen($grupo) != 1)
            throw new WCexception("Grupo invalido");

        $aux = strtoupper($grupo);
        $aux = ord($aux);
        if($aux < 65 or $aux > 72)
            throw new WCexception("Grupo invalido");

        $this->grupo = strtoupper($grupo);
    }

    /**
     * @return string
     */
    public function getGrupo() : string
    {
        return $this->grupo;
    }

    /**
     * @return integer
     */
    public function getId() : int
    {
        return $this->idselecao;
    }

    /**
     * @return mixed
     */
    public function getContinente()
    {
        return $this->continente;
    }
    /**
     * @return string
     */
    public function getNome() : string
    {
        return $this->nome;
    }
    public function toJson()
    {
        $json = new class
        {
            public $nome;
            public $grupo;
            public $idselecao;
            public $continente;
        };
            $json->nome = $this->getNome();
            $json->idselecao = $this->getId();
            $json->grupo = $this->getGrupo();
            $json->continente = $this->getContinente();

        return json_decode(json_encode($json));
    }
    public static function convertJson(string $json)
    {
        $json = json_decode($json);
        $retorno = new selecao();
    }
}