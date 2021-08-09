var aws = require('aws-sdk');

var endpoint  = 'yyyyyyyy.amazonaws.com';
var thingName = 'xxxxx';

exports.handler = async (event, context) => {
    // TODO implement
    console.log('VentilationLambda 01');
    var iotdata = new aws.IotData( { endpoint: endpoint } );
    console.log("event JSON:", JSON.stringify(event, null, 2));

    var params = { thingName: thingName };
    iotdata.getThingShadow(params, function (err, data) {
        if (!err) {
            
            var payload = JSON.parse(data.payload);
            console.log("payload : " + JSON.stringify(payload, null, 2));
            var sound = payload.state.reported.sound;
            var co2 = payload.state.reported.co2;
            console.log("sound : " + sound);
            console.log("co2 : " + co2);
            //var currentBlinkPattern = payload.state.desired.blinkPattern;
            
            var errorcnt = 0 ;
            if(sound > 50){
                errorcnt++;
            }
            if(co2 > 1000){
                errorcnt++;
            }

            var status ;
            if(errorcnt >= 2){
                status = "ALML1  ";
            }
            else if(errorcnt == 1){
                status = "ALML2  ";
            }
            else{
                status = "NORM   ";
            }
                
            var desiredState = {
                state: {
                    desired: {
                        hvacStatus: status
                    }
                }
            };
 
            var params = {
              thingName: thingName,
              payload: JSON.stringify(desiredState)
            };
            iotdata.updateThingShadow(params, function (err, data) {
                if (!err) {
                    context.succeed();
                } else {
                    context.fail(err);      
                }
            });
        }
        else{
            console.log("getThingShadow error "+err);
        }

    });
    console.log('exports.handler end');
};