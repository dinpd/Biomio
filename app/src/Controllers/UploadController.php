<?php

namespace App\Controllers;

use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

final class UploadController
{
    protected $logger;
    private $_profilePath;
    private $_companyLogoPath;
    private $_locationPicturePath;

    public function __construct(LoggerInterface $logger, $settings)
    {
        $this->logger = $logger;
        $this->_profilePath = $settings['upload']['profilePicturePath'];
        $this->_companyLogoPath = $settings['upload']['companyLogoPath'];
        $this->_locationPicturePath = $settings['upload']['locationPicturePath'];

    }

    public function profilePictureWebcam(Request $request, Response $response, $args)
    {
        /* testing is required in case of usage for this style
           because it use php://input */
        // $img = $request->getParam('file'); //<-- to use this style w
        $img = $request->$_POST['file'];
        $img = str_replace('data:image/png;base64,', '', $img);
        $img = str_replace(' ', '+', $img);
        $data = base64_decode($img);
        $file = $this->_profilePath . $_POST['user'] . ".jpg";
        if (file_exists($file)) {
            unlink($file);
        }
        file_put_contents($file, $data);

        return $response->write("Webcam upload Success");
    }

    private function _uploadHandler($path, $fileName){
        if ($_FILES["file"]["error"] > 0)
            return "Error: " . $_FILES["file"]["error"] . "<br>";
        else if ($_FILES["file"]["size"] < 3000000) {
            $temp = explode(".", $_FILES["file"]["name"]);
            move_uploaded_file($_FILES["file"]["tmp_name"], $path . $fileName . ".jpg");
            return "Success";
        } else return "file is too big";

    }

    private function _deleteHandler($path,$filename){
        if (unlink($path . $filename . ".jpg"))
            return "Success";
    }

    public function profilePictureUpload(Request $request, Response $response, $args)
    {
        return $response->write(
            $this->_uploadHandler($this->_profilePath,$_POST['user'])
        );
    }


    public function profilePictureDelete(Request $request, Response $response, $args)
    {
        if (unlink($this->_profilePath . $_POST['user'] . ".jpg"))
            return $response->write("Success");
    }


    public function providerLogoUpload(Request $request, Response $response, $args)
    {
        return $response->write(
            $this->_uploadHandler($this->_companyLogoPath,$_POST['provider'])
        );

    }


    public function providerLogoDelete(Request $request, Response $response, $args)
    {
        return $response->write($this->_deleteHandler($this->_companyLogoPath,$_POST['provider']));
    }


    public function locationPictureUpload(Request $request, Response $response, $args)
    {
        return $response->write(
            $this->_uploadHandler($this->_locationPicturePath,$_POST['location'])
    );
    }


    public function locationPictureDelete(Request $request, Response $response, $args)
    {
        return $response->write($this->_deleteHandler($this->_locationPicturePath,$_POST['location']));
    }


}