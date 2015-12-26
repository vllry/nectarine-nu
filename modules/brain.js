var sys = require('sys')
var exec = require('child_process').exec;

var config = require('../config');
var database = require('../database');
var temperature = require('./temperature');
var powertail = require('./powertail');



var radii = config.coordinates.radius;
radii.unshift(0); //Prepend a 0



var determineState = function(mode) { //mode==1 -> on, mode==0 -> off
	if (mode == 1 ) {
		temperature.getTemperature(function (current) {
			database.settingGet('temp', function(desired) {
				if (current - desired > 1) {
					powertail.set(false);
				}
				else if (desired - current > 1) {
					powertail.set(true);
				}
			}, function (err) {
				console.log(err);
			});
		}, function (err) {
			console.log(err);
		});
		return;
	}
	console.log('off mode');
	powertail.set(false)
};



var determineIfComingHome = function() {
	database.getCoordinates(999999, 1, function(coordinates) {
		if (!coordinates.length) {
			determineState(0);
			return;
		}
		var place = coordinates[0];

		for (var i = 1; i < radii.length; i++) {
			if (place.distance <= radii[i]) {
				database.getPreviousRing(radii[i-1], radii[i], function(result) {
					if (result[0].distance >= radii[i]) {
						console.log("Headed inland cap'n");
						//Now to determine how long you've been in the current radius ring
						var beenInRingFor = place.time - result[0].time;
						console.log("Been in ring for " + beenInRingFor);
						if (beenInRingFor <= 120) {
							determineState(1);
							return;
						}
					}
					determineState(0);
				}, function (err) {
					console.log('no :/');
					console.log(err);
				});
				break;
			}
		}

	}, function(err) {
		console.log("oshi");
		console.log(err);
		determineState(0);
	});
};



exports.run = function() {
	setInterval(function() {
		database.settingGet('mode', function(mode) {

			if (mode == 2) { //Automatic mode
				exec("ping -c 1 " + config.phoneIP, function(err, stdout, stderr) { //Check if phone is on the LAN
					if (err) { //Ping failed, attempt to determine if you're coming home
						determineIfComingHome();
					}
					else { //Ping success, you're at home
						determineState(1);
					}
				});
			}
			else {
				determineState(mode);
			}

		}, function (err) {
			console.log(err);
		});
	}, 10 * 1000);	//Every 10s
};
