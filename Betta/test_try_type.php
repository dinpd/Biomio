<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Biomio Policy Try Type</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
</head>
<body>
<div>
    <br><br>
    <input type="button" class="try_type_button" data-try-type="face-photo" value="Switch to Face recognition"><br><br>
    <input type="button" class="try_type_button" data-try-type="fp-scanner" value="Switch to Finger recognition"><br>
    <div id="info_area" hidden></div>
</div>
<script>
    $.ajax({
            url: 'https://gate.biom.io/set_condition/',
            type: 'GET',
            data:{},
            success: function(data) {
                console.log(data);
            },
            error: function(error) {
            }
        });

    $('.try_type_button').on('click', function(e){
        e.preventDefault();
        var info_area = $('#info_area');
        info_area.hide();
        var try_type = $(e.currentTarget).attr('data-try-type');
        $.ajax({
            url: 'https://gate.biom.io/set_try_type/' + try_type,
            type: 'post',
            data:{},
            success: function(){
                info_area.text('Try type successfully changed.');
                info_area.show();
            },
            error: function(error){
                if(error.responseText.length == 0){
                    info_area.text('Try type successfully changed.');
                }else{
                    info_area.html(error.responseText);
                }
                info_area.show();
            }
        });
    });
</script>
</body>
</html>


Hi Alex,

I added rest call - /set_condition/ . It is available on test Gate.

on GET it will return you the list of available auth types.
on POST you must include following json into request body:

{"condition":"all","auth_types":["face","fp"],"user_id":123}

condition maybe one of - all / any .

For some reason I'm not able to run REST calls on test AI from test Gate, I changed the rest url to https://biom.io:4433 but every time it returns me "Not found". I changed rest url from private IP because SSL certificate is configured for biom.io domains and it doesn't allow to connect by IP through SSL....


Thanks,
Andriy L.