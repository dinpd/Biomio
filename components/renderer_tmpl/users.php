<html>
<head></head>

<body>

<h3>Users count: <?php echo count($users);?></h3>

<table style="width:100%">
    <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Registration date</th>
        <th>Last access date</th>
    </tr>

    <?php foreach($users as $user){?>
        <tr>
            <td><?php echo $user['firstName'];?></td>
            <td><?php echo $user['lastName'];?></td>
            <td><?php echo $user['email'];?></td>
            <td><?php echo $user['date_created'];?></td>
            <td><?php echo $user['dateModified'];?></td>
        </tr>
    <?php }?>
</table>
</body>
</html>