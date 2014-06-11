var express = require('express');
var request = require('request');
var app = express();

const PORT = 3000;

app.get('/check/:reg', function(req, res) {

    var input = req.params.reg;

    // Initial GET request to set session cookies
    request({
        method: 'GET',
        url: 'https://motor.confused.com/',
        jar: true       // Remember cookies
    }, function(err, response, body) {

        // POST request to lookup up reg
        request({
            method: 'POST',
            url: 'https://motor.confused.com/Motor/RegistrationLookup',
            form: {
                registrationNumber: input
            },
            json: true, // Set response content-type to json
            jar: true   // Remember cookies

        },
        function(err, response, body) {

            var result = {
                input: input
            };

            if (!body || !body.data) {
                result.message = 'No vehicle found';
            } else {
                // PROCESS BODY
                var vehicleData = body.data;

                // vehicle property is returned as JSON string - convert to JSON object
                if (vehicleData.vehicle) {
                    var vehicleObjectStr = vehicleData.vehicle;
                    var vehicleObject = JSON.parse( vehicleObjectStr );
                    vehicleData.vehicle = vehicleObject;
                }

                result.vehicleData = vehicleData;
            }

            // Send response
            res.json( result );
        });

    });

});

app.listen(PORT);
console.log('Listening on port', PORT);