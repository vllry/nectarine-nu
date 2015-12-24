var sys = require('sys')
var exec = require('child_process').exec;

var config = require('../config');
var database = require('../database');
var temperature = require('./temperature');
var powertail = require('./powertail');



var determineState = function(mode) { //mode==1 -> on, mode==2 -> off
	if (mode == 1 ) {
		temperature.getTemperature(function (current) {
			database.settingGet('temp', function(desired) {
				console.log(current);
				console.log(desired);
				if (current - desired > 1) {
					console.log('off');
					powertail.set(false);
				}
				else if (desired - current > 1) {
					console.log('on');
					powertail.set(true);
				}
				else {
					console.log(current - desired);
				}
			}, function (err) {
				console.log(err);
			});
		}, function (err) {
			console.log(err);
		});
	}
	else {
		console.log('off mode');
		powertail.set(false)
	}
};



exports.run = function() {
	setInterval(function() {
		database.settingGet('mode', function(mode) {

			if (mode == 2) { //Automatic mode
				exec("ping -c 1 " + config.phoneIP, function(err, stdout, stderr) { //Check if phone is on the LAN
					if (err) { //Ping failed
						mode = 0;
					}
					else {
						mode = 1;
					}
					determineState(mode);
				});
			}
			else {
				determineState(mode);
			}

		}, function (err) {
			console.log(err);
		});
	}, 20 * 1000);	//Every 20s
};
