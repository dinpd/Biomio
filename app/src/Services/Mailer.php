<?php
namespace App\Services;

use Mailgun\Mailgun;

class Mailer
{

    private $_templatePath;
    private $_mailerProvider;

    private $_to;
    private $_subject;
    private $_body;
    private $_body_html;
    private $_from;
    private $_from_name;

    public function __construct($view, $logger, $settings)
    {

        $this->_templatePath = $settings['mailer_service']['template_path'];
        $this->_mailerProvider = $settings['mailer_service']['provider'];

    }

    public function sendMail($to, $subject, $body, $from, $from_name)
    {

        $this->_to = $to;
        $this->_subject = $subject;
        $this->_body = $body;
        $this->_from = $from;
        $this->_from_name = $from_name;
        return $this->_sendWithProvider();
    }

    public function sendMailHtml($to, $subject, $template_name, $from, $from_name, array $template_data = [])
    {
        $this->_body_html = $this->_renderTemplate($template_name, $template_data);
        $body = '';
        return $this->sendMail($to, $subject, $body, $from, $from_name);

    }

    private function _sendWithProvider()
    {

        if ($this->_mailerProvider['name'] == 'MailerGun') {


            $mgClient = new Mailgun(
                $this->_mailerProvider['apiKey'],
                isset($this->_mailerProvider['apiEndPoint']) ? $this->_mailerProvider['apiEndPoint'] : 'api.mailgun.net'
            );

            $domain = $this->_mailerProvider['domain'];

            return $mgClient->sendMessage("$domain",
                array('from' => $this->_from_name . ' <' . $this->_from . '>',
                    'to' => $this->_to,
                    'subject' => $this->_subject,
                    'text' => $this->_body,
                    'html' => $this->_body_html)
            );

        }
        return false;
    }

    private function _renderTemplate($template, $data)
    {

        if (isset($data['template'])) {
            throw new \InvalidArgumentException("Duplicate template key found");
        }


        if (!is_file($this->_templatePath . $template)) {
            throw new \RuntimeException("View cannot render `$template` because the template does not exist");
        }

        $render = function ($template, $data) {
            extract($data);
            include $template;
        };

        ob_start();
        $render($this->_templatePath . $template, $data);
        $output = ob_get_clean();

        return $output;

    }

    /* -------------         For Following methods refactoring is still Required   --------------------------*/


    public function welcome_email($email, $first_name, $last_name, $code)
    {
        $to = $email;

        $from = "BIOMIO service <service@biom.io>";
        $from = "service@biom.io";
        $from_name = "BIOMIO service";
        $subject = "BIOMIO: Email Verification";


        $body = file_get_contents($this->_templatePath . "WelcomeEmail.html");
        //$body = file_get_contents("../tpl/emails/WelcomeEmail.html");

        $body = str_replace('%email%', $email, $body);
        $body = str_replace('%first_name%', $first_name, $body);
        $body = str_replace('%last_name%', $last_name, $body);
        $body = str_replace('%code%', $code, $body);

        $this->_body_html = $body;
        $body = '';
        return $this->sendMail($to, $subject, $body, $from, $from_name);
    }

    public function welcome2_email($email, $first_name, $last_name, $code)
    {
        $to = $email;

        $from = "BIOMIO service <service@biom.io>";
        $from = "service@biom.io";
        $from_name = "BIOMIO service";
        $subject = "BIOMIO: Email Verification";

        $body = file_get_contents($this->_templatePath . "Welcome2Email.html");
        //$body = file_get_contents("../tpl/emails/Welcome2Email.html");
        $body = str_replace('%email%', $email, $body);
        $body = str_replace('%first_name%', $first_name, $body);
        $body = str_replace('%last_name%', $last_name, $body);
        $body = str_replace('%code%', $code, $body);

        $this->_body_html = $body;
        $body = '';
        return $this->sendMail($to, $subject, $body, $from, $from_name);
    }

    public function send_email_verification_code($email, $first_name, $last_name, $code)
    {
        $to = $email;
        $from = "BIOMIO login <login@biom.io>";
        $from = "login@biom.io";
        $from_name = "BIOMIO login";
        $subject = "BIOMIO: Email Verification";

        $body = file_get_contents($this->_templatePath . "EmailVerification.html");
        //$body = file_get_contents("../tpl/emails/EmailVerification.html");
        $body = str_replace('%email%', $email, $body);
        $body = str_replace('%first_name%', $first_name, $body);
        $body = str_replace('%last_name%', $last_name, $body);
        $body = str_replace('%code%', $code, $body);

        $this->_body_html = $body;
        $body = '';
        return $this->sendMail($to, $subject, $body, $from, $from_name);
    }

    public function login_code($code, $email)
    {
        //$to = "ditkis@gmail.com";
        $from = "BIOMIO login <login@biom.io>";
        $from = "login@biom.io";
        $from_name = "BIOMIO login";
        $subject = "BIOMIO: Temporary login code";
        $to = $email;

        $body = file_get_contents($this->_templatePath . "LoginCode.html");
        //$body = file_get_contents("../tpl/emails/LoginCode.html");
        $body = str_replace('%code%', $code, $body);

        $this->_body_html = $body;
        $body = '';
        return $this->sendMail($to, $subject, $body, $from, $from_name);
    }

    // ------------------- TODO: Useless?
    public function contact($name, $email, $message)
    {
        //$to = "ditkis@gmail.com";
        $from = "BIOMIO service <service@biom.io>";
        $from_name = "BIOMIO service";
        $subject = "BIOMIO: New Message from User";

        $body = file_get_contents($this->_templatePath . "ContactEmail.html");
        //$body = file_get_contents("../tpl/emails/ContactEmail.html");
        $body = str_replace('%name%', $name, $body);
        $body = str_replace('%email%', $email, $body);
        $body = str_replace('%message%', $message, $body);

        $this->_body_html = $body;
        $body = '';
        $to = "alexander.lomov1@gmail.com";
        $this->sendMail($to, $subject, $body, $from, $from_name);
        return $response->write('#success');
    }

    public function provider_app_registration($email, $code)
    {

        /*  turned OFF, because original legacy code contains an error

        //$to = "ditkis@gmail.com";
        $from = "BIOMIO service <service@biom.io>";
        $from_name = "BIOMIO service";
        $subject = "BIOMIO: Application Registration";

        $body = file_get_contents($this->_templatePath . "ProviderAppRegistration.html");
        //$body = file_get_contents("../../tpl/emails/ProviderAppRegistration.html.html");
        $body = str_replace('%code%',$code,$body);


        $headers = "From: $from\n";
        $headers .= "MIME-Version: 1.0\n";
        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
        $to = $email;
      //  mail($to, $subject, $body, $headers);


       // $to = "alexander.lomov1@gmail.com";
        //Helper::monkey_mail($to, $subject, $body, $from, $from_name);

        $this->_body_html = $body;
        $body='';
        $this->sendMail($to,$subject,$body,$from,$from_name);
        //$to = "ditkis@gmail.com";
        //Helper::monkey_mail($to, $subject, $body, $from, $from_name);
        return '#success';
        */
    }


}