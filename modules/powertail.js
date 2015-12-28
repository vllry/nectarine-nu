var gpio = require("pi-gpio"); //https://www.npmjs.com/package/pi-gpio

var config = require("../config");

var pin = config.pins.powertail; //https://ms-iot.github.io/content/images/PinMappings/RP2_Pinout.png
				//Pin number is based on physical board, not GPIO label

var connectedPins = {};

var getOutputPin = function (pin, func) {
	if (connectedPins[pin] !== undefined) {
		func();
	} else {
		gpio.close(pin, function() { // Close it incase it was opened by a previous instance of the app
			gpio.open(pin, "output", function (err) { //Open pin for output
				connectedPins[pin] = true;
				func();
			});
		});
	}
};

exports.set = function (power) {
	getOutputPin(pin, function () {
		gpio.write(pin, !power, function () {
			return;
		});
	});
};
