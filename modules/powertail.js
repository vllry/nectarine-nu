var gpio = require("pi-gpio"); //https://www.npmjs.com/package/pi-gpio

var config = require("../config");

var pin = config.pins.powertail; //https://ms-iot.github.io/content/images/PinMappings/RP2_Pinout.png
				//Pin number is based on physical board, not GPIO label



exports.set = function(power) {
	gpio.open(pin, "output", function(err) { //Open pin for output
		gpio.write(pin, power, function() { //"gpio-admin: could not flush data to /sys/class/gpio/export: Device or resource busy" isn't a meaningful error
			return;
		});
	});
};
