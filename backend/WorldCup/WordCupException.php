<?php
/**
 * Created by PhpStorm.
 * User: rafael
 * Date: 06/07/18
 * Time: 19:32
 */

/**
 * Class WCException
 */
class WCException extends Exception
{
    public function __construct(string $message = "", int $code = 1, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $error = array("code" => $code,"msg" => $message);
        die(json_encode(array("error"=> $error,"content" => null ),JSON_UNESCAPED_UNICODE));
    }
}