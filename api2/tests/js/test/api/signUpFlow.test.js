/* Settings */

    /*URI for testing endpoint*/
var uri = "http://localhost:8081",
    /*
     providerPublicKey, and providerPrivateKey
     you can obtain from ProviderKeys table.
     */
    providerPublicKey = "sjP54d8vb2hf9uk",
    providerPrivateKey = "gBf3Vfc_k1ya2_f1_F6Gsl_d30zikv",
    nonce="12345";

/* Settings  END */

var supertest = require("supertest");
var crypto = require('crypto');
var should = require("should");

var server = supertest.agent(uri);
var chance = require('chance').Chance();

var profileId,
    deviceId,
    digest,
    data,
    reqPath,
    genRandGMail;


function generate_hmac(method, reqPath, data, nonce) {
    var input;
    if (data === "") {
        input = method + uri + reqPath + nonce;
    } else {
        input = method + uri + reqPath + JSON.stringify(data) + nonce;
    }
    return crypto.createHmac('sha256', providerPrivateKey).update(input).digest('hex');
}


describe('should be able to pass registration', function () {
    this.timeout(850000);

    before(function (done) {
        genRandGMail = "api-test-" + chance.email({domain: 'gmail.com'});
        uri.should.not.be.empty();
        providerPublicKey.should.not.be.empty();
        providerPrivateKey.should.not.be.empty();
        done();
    });


    it("should not be able to sign up", function (done) {

        data = {
            "hash": "56ce9a6a93c17d2c867c5c293482b8f9",
            "time": "85a879a19387afe791039a88b354a374",
            "public_key": "authorization_code",
            "email": "rjhdsy@gmail.com"
        };

        server
            .post('/api2/v1/sign_up')
            .send(data)
            .set('Content-Type', 'application/json')
            .end(function (err, res) {
                console.log(res);
                res.body.should.have.property('message');
                res.body.message.should.be.equal('X-Authorization header is required');
                done();
            });
    });


    it("should be able to sign up", function (done) {

        data = {
            "hash": "56ce9a6a93c17d2c867c5c293482b8f9",
            "time": "85a879a19387afe791039a88b354a374",
            "public_key": "authorization_code",
            "email": genRandGMail
        };

        reqPath = '/api2/v1/sign_up';
        digest = generate_hmac("POST", reqPath, data, nonce);

        server
            .post(reqPath)
            .send(data)
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC ' + providerPublicKey + ':' + nonce + ':' + digest)
            .end(function (err, res) {

                res.body.should.have.property('profileId');

                profileId = res.body.profileId;
                done();

            });
    });


    it("should be able to add device", function (done) {

        data = {
            "name": "IphoneTestAPI",
            "title": "my Iphone title"
        };

        reqPath = '/api2/v1/user/' + profileId + '/device';
        digest = generate_hmac("POST", reqPath, data, nonce);

        server
            .post(reqPath)
            .send(data)
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC ' + providerPublicKey + ':' + nonce + ':' + digest)
            .end(function (err, res) {

                res.body.should.have.property('deviceId');
                deviceId = res.body.deviceId;

                done();
            });

    });


    it("generate device code", function (done) {

        reqPath = '/api2/v1/user/' + profileId + '/device/' + deviceId + '/code';
        digest = generate_hmac("GET", reqPath, "", nonce);

        server
            .get(reqPath)
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC ' + providerPublicKey + ':' + nonce + ':' + digest)
            .end(function (err, res) {

                res.body.should.have.property('code');
                done();

            });
    });


    it("generate biometrics code", function (done) {

        reqPath = '/api2/v1/user/' + profileId + '/device/' + deviceId + '/biometrics-code';
        digest = generate_hmac("GET", reqPath, "", nonce);

        server
            .get(reqPath)
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC ' + providerPublicKey + ':' + nonce + ':' + digest)
            .end(function (err, res) {

                res.body.should.have.property('code');
                done();

            });
    });


    it("generate extension code", function (done) {

        reqPath = '/api2/v1/user/' + profileId + '/device/' + deviceId + '/extension-code';
        digest = generate_hmac("GET", reqPath, "", nonce);
        server
            .get(reqPath)
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC ' + providerPublicKey + ':' + nonce + ':' + digest)
            .end(function (err, res) {

                res.body.should.have.property('code');
                done();

            });
    });


    it("check status for code", function (done) {

        reqPath = '/api2/v1/status/verification-code/L1gPtemk';
        digest = generate_hmac("GET", reqPath, "", nonce);

        server
            .get(reqPath)
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC ' + providerPublicKey + ':' + nonce + ':' + digest)
            .end(function (err, res) {

                res.body.should.have.property('status');
                done();

            });
    });


});


