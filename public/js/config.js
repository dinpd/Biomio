// production
var chromeRuntimeKey = 'lgefcndmlikkmgielaeiflkmmgboljhm';
var biomIoPort = ':5001'
var developmentPort = ''; // for prod  developmentPost = ''; is empty
var displayQrCode = false;
var basicUrl = 'http://biom.io';
var openIdProviderToken = basicUrl + biomIoPort +'/user/authorize?response_type=code&external_token={external_token}' +
    '&scope=openid&client_id=56ce9a6a93c17d2c867c5c293482b8f9&nonce=12p6bfw&state=1slw5l8&redirect_uri=https://biom.io' + developmentPort +
    '/login/openId';
var openIdProvider = basicUrl + biomIoPort +'/user/authorize?response_type=code' +
    '&scope=openid&client_id=56ce9a6a93c17d2c867c5c293482b8f9&nonce=12p6bfw&state=1slw5l8&redirect_uri=https://biom.io' + developmentPort +
    '/login/openId';

//var openIdProviderToken = basicUrl + biomIoPort +'/user/authorize?response_type=code&external_token={external_token}' + '&scope=openid&client_id=56ce9a6a93c17d2c867c5c293482b8f9&redirect_ur$


var getToken = function(external_token){
    if(displayQrCode) {
        window.open(openIdProvider,'null','width=460, height=485, location=no');
    } else {
        if (external_token.length != 0) {

         window.open(
                openIdProviderToken.replace('{external_token}',external_token),
                'null','width=460, height=485, location=no'
            );
        }
    }
    return false;
}
