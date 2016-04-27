<?php
namespace App\Controllers;

use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

//TODO:refactor DB interaction into model, repository or helper
use ORM;

final class DomainController
{
    protected $logger;
    private $_tempWebsiteFilesPath;
    private $_websiteScreenshotPath;


    public function __construct(LoggerInterface $logger, $settings)
    {
        $this->logger = $logger;

        $this->_tempWebsiteFilesPath= $settings['upload']['tempWebsiteFilesPath'];
        $this->_websiteScreenshotPath= $settings['upload']['websiteScreenshotPath'];
    }

    public function create(Request $request, Response $response, $args)
    {

        $domain = $request->getParam('domain');

        $tempWebSiteCodes = ORM::for_table('TempWebsiteCodes')->where('domain', $domain)->find_one();

        if ($tempWebSiteCodes) {
            $filename = $tempWebSiteCodes->filename;
            $code = $tempWebSiteCodes->code;
            return $response->write($filename . '|' . $code);
        }


        $charset = array('0', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
        $code = '';
        for ($i = 0; $i < 15; $i++) {
            $code = $code . $charset[rand(0, count($charset)) - 1];
        }
        $code = $code;

        $filename = '';
        for ($i = 0; $i < 15; $i++) {
            $filename = $filename . $charset[rand(0, count($charset)) - 1];
        }
        $filename = 'BIOMIO_' . $filename . '.txt';

        $tempWebSiteCode = ORM::for_table('TempWebsiteCodes')->create();
        $tempWebSiteCode->domain = $domain;
        $tempWebSiteCode->code = $code;
        $tempWebSiteCode->filename = $filename;
        $tempWebSiteCode->save();

        //Adding file
        $fh = fopen($this->_tempWebsiteFilesPath . $filename, 'rw') or die("can't open file");
        fwrite($fh, $code);
        fclose($fh);


    }

    public function verify(Request $request, Response $response, $args)
    {

        $domain = $request->getParam('domain');

        $tempWebSiteCodes = ORM::for_table('TempWebsiteCodes')->where('domain', $domain)->find_one();

        $filename = $tempWebSiteCodes->filename;
        $code = $tempWebSiteCodes->code;
        //TODO: ugly, need refactor
        $url = 'http://' . $domain . '/' . $filename;

        $file_headers = @get_headers($url);
        if ($file_headers[0] == 'HTTP/1.1 404 Not Found') {
            $exists = false;
        } else {
            $fh = fopen($url, 'r');
            $theData = fread($fh, 15);
            fclose($fh);
            if ($theData == $code) {
                return $response->write('approved');
            }
        }

    }

    public function createScreenshot(Request $request, Response $response, $args)
    {

        $domain = $request->getParam('domain');
        //TODO: ugly, require refactor
        if (gethostbyname($domain) == $domain) {
            echo "NO DNS Record found";
        } else {
            $sites = "http://" . $domain;

            $sites = preg_split('/\r\n|\r|\n/', $sites);

            foreach ($sites as $site) {
                //cache image
                $image = file_get_contents("https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=$site&screenshot=true");
                $image = json_decode($image, true);
                $image = $image['screenshot']['data'];
                $image = str_replace(array('_', '-'), array('/', '+'), $image);

                $file = $this->_websiteScreenshotPath . $domain . ".png";

                if (file_exists($file)) {
                    unlink($file);
                }

                $img = str_replace('data:image/png;base64,', '', $image);
                $img = str_replace(' ', '+', $img);
                $data = base64_decode($img);
                $file = $this->_websiteScreenshotPath . $domain . ".png";

                if (file_exists($file)) {
                    unlink($file);
                }

                file_put_contents($file, $data);
            }
        }

    }

}