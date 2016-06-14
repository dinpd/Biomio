<?php


$config['db'] =  array(
    'host' => '6da7f2ba42c999a5da5b0937632bd595a03f65c1.rackspaceclouddb.com',
    'user' => 'biomio_admin',
    'password' => 'admin',
    'dbName' => 'biomio_db_test',
    'port'=>'3306'
);


/*
$config['db'] =  array(
    'host' => '127.0.0.1',
    'user' => 'biomio_admin',
    'password' => 'admin',
    'dbName' => 'biomio_db_test',
    'port'=>'3309'
);
*/

ORM::configure('mysql:host=' . $config['db']['host'] . ';dbname=' . $config['db']['dbName'] . ';port='.$config['db']['port'].';charset=utf8');
ORM::configure('username', $config['db']['user']);
ORM::configure('password', $config['db']['password']);
ORM::configure('return_result_sets', true);
// prevent returning data with string type
ORM::configure('driver_options', array(PDO::ATTR_EMULATE_PREPARES => false));


ORM::configure('id_column_overrides', array(
    'Applications' => 'app_id',
    'application_userinformation' => 'application',
));


//use Illuminate\Database\Capsule\Manager as Capsule;
//
//$capsule = new Capsule;
//
//$capsule->addConnection([
//    'driver'    => 'mysql',
//    'host'      => 'localhost',
//    'database'  => 'boilerplate_slim',
//    'username'  => 'root',
//    'password'  => '',
//    'charset'   => 'utf8',
//    'collation' => 'utf8_unicode_ci',
//    'prefix'    => '',
//]);
//
//// Set the event dispatcher used by Eloquent models... (optional)
//use Illuminate\Events\Dispatcher;
//use Illuminate\Container\Container;
//$capsule->setEventDispatcher(new Dispatcher(new Container));
//
//// Make this Capsule instance available globally via static methods... (optional)
//$capsule->setAsGlobal();
//
//// Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
//$capsule->bootEloquent();
