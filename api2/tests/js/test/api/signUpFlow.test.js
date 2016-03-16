var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:8081");
var chance = require('chance').Chance();
var tempmail = "rjhdsy@gmail.com"; /* Sergio's mail */
var profileId = 36; /* Sergio */
var deviceId = 654;


describe('should be able to pass registration', function () {

    before(function (done) {
        tempmail = "api-test-" + chance.email({domain: 'gmail.com'});
        done();
    });


    it("should not be able to sign up", function (done) {
        server
            .post('/api2/v1/sign_up')
            .send({
                "hash": "56ce9a6a93c17d2c867c5c293482b8f9",
                "time": "85a879a19387afe791039a88b354a374",
                "public_key": "authorization_code",
                "email": "rjhdsy@gmail.com"
            })
            .set('Content-Type', 'application/json')
            .end(function (err, res) {
                res.body.should.have.property('message');
                res.body.message.should.be.equal('X-Authorization header is required');
                done();
            });
    });

    it("should be able to sign up", function (done) {
        this.timeout(150000);
        server
            .post('/api2/v1/sign_up')
            .send({
                "hash": "56ce9a6a93c17d2c867c5c293482b8f9",
                "time": "85a879a19387afe791039a88b354a374",
                "public_key": "authorization_code",
                "email": tempmail //"rjhdsy@gmail.com"
            })
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC sjP54d8vb2hf9uk:12345:8d4857a9c851d69705ebb8a8b8da96fa3469b5a363d537e9e23afd8f1c4723e0')
            .end(function (err, res) {

                res.body.should.have.property('profileId');

                profileId = res.body.profileId;
                done();

            });
    });


    it("should be able to add device", function (done) {
        server
            .post('/api2/v1/user/' + profileId + '/device')
            .send({
                "name": "IphoneTestAPI",
                "title": "my Iphone title"
            })
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC sjP54d8vb2hf9uk:12345:8d4857a9c851d69705ebb8a8b8da96fa3469b5a363d537e9e23afd8f1c4723e0')
            .end(function (err, res) {

                res.body.should.have.property('deviceId');
                deviceId = res.body.deviceId;

                done();
            });

    });

    it("generate device code", function (done) {
        server
            .get('/api2/v1/user/' + profileId + '/device/' + deviceId + '/code')
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC sjP54d8vb2hf9uk:12345:8d4857a9c851d69705ebb8a8b8da96fa3469b5a363d537e9e23afd8f1c4723e0')
            .end(function (err, res) {

                res.body.should.have.property('code');
                done();

            });
    });

    it("generate biometrics code", function (done) {
        server
            .get('/api2/v1/user/' + profileId + '/device/' + deviceId + '/biometrics-code')
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC sjP54d8vb2hf9uk:12345:8d4857a9c851d69705ebb8a8b8da96fa3469b5a363d537e9e23afd8f1c4723e0')
            .end(function (err, res) {

                res.body.should.have.property('code');
                done();

            });
    });

    it("generate extension code", function (done) {
        server
            .get('/api2/v1/user/' + profileId + '/device/' + deviceId + '/extension-code')
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC sjP54d8vb2hf9uk:12345:8d4857a9c851d69705ebb8a8b8da96fa3469b5a363d537e9e23afd8f1c4723e0')
            .end(function (err, res) {

                res.body.should.have.property('code');
                done();

            });
    });

    it("check status for code", function (done) {
        server
            .get('/api2/v1/status/verification-code/L1gPtemk')
            .set('Content-Type', 'application/json')
            .set('X-Authorization', 'HMAC sjP54d8vb2hf9uk:12345:8d4857a9c851d69705ebb8a8b8da96fa3469b5a363d537e9e23afd8f1c4723e0')
            .end(function (err, res) {

                res.body.should.have.property('status');
                done();

            });
    });


});