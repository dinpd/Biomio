// development
var chromeRuntimeKey = 'ooilnppgcbcdgmomhgnbjjkbcpfemlnj';
var biomIoPort = ':5000'; // 5001 -> for production
var developmentPort = ':4433'; // from prod  developmentPort = ''; is empty
var displayQrCode = true;
var basicUrl = 'http://biom.io';
var openIdProviderToken = basicUrl + biomIoPort +'/user/authorize?response_type=code&external_token={external_token}' +
    '&scope=openid&client_id=56ce9a6a93c17d2c867c5c293482b8f9&redirect_uri=https://biom.io' + developmentPort +
    '/login/openId/&nonce=12p6bfw&state=1slw5l8';
var openIdProvider = basicUrl + biomIoPort +'/user/authorize?response_type=code' +
    '&scope=openid&client_id=56ce9a6a93c17d2c867c5c293482b8f9&redirect_uri=https://biom.io' + developmentPort +
    '/login/openId/&nonce=12p6bfw&state=1slw5l8';


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