<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Users | BIOMIO</title>
    <link rel="shortcut icon" href="favicon.ico" >
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">
<!--    <link rel="stylesheet" href="/../../js/libs/tableSorterStyles/blue/style.css">-->
    <link rel="stylesheet" href="/../../js/libs/tableSorterStyles/blue/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>

<body style="margin: 0 auto; text-align: center">


<div class="container">
    <div class="row">
        <div><h3>Users count: <?php echo count($users);?></h3></div>

        <div class="panel-footer table-responsive">
            <table  class='table table-striped panel tablesorter'>
                <thead>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Registration date</th>
                    <th>Last access date</th>
                </thead>
                <tbody>
                <?php foreach($users as $user){?>
                    <tr>
                        <td><?php echo $user['firstName'];?></td>
                        <td><?php echo $user['lastName'];?></td>
                        <td><?php echo $user['email'];?></td>
                        <td><?php echo $user['date_created'];?></td>
                        <td><?php echo $user['dateModified'];?></td>
                    </tr>
                <?php }?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
<script src="/../../js/libs/jquery.tablesorter.min.js"></script>

<script>
    $(document).ready(function()
        {
            $(".table").tablesorter();
        }
    );
    $(document).on('click touchend', ".close", function () {
        $(this).addClass('hide');
        $(this).siblings('.options').removeClass('hide');
    });
    $(document).on('click touchend', ".no", function () {
        $(this).siblings('.close').removeClass('hide');
        $(this).siblings('.options').addClass('hide');
        $(this).addClass('hide');
    });


</script>

</body>
</html>