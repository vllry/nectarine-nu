var gpio = require("pi-gpio"); //https://www.npmjs.com/package/pi-gpio

var config = require("../config");

var pin = config.pins.powertail;



var set = function(power) {
	gpio.open(pin, "output", function(err) { //Open pin for output
		gpio.write(pin, power, function() {
			gpio.close(pin);
		});
	});
};Edge and point drawing studies 
