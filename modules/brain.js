var sys = require('sys')
var exec = require('child_process').exec;

var config = require('../config');
var database = require('../database');
var temperature = require('./temperature');
var powertail = require('./powertail');



var radii = config.coordinates.radius;
radii.unshift(0); //Prepend a 0


/*
0 - off
1 - on
3 - FORCE on
 */
var determineState = function(mode) { //mode==1 -> on, mode==0 -> off
	if (mode == 1 ) {
		temperature.getTemperature(function (current) {
			database.settingGet('temp', function(desired) {
				if (current - desired > 1) {
					console.info("Current temperature ("+current+") near target ("+desired+"), disabling");
					powertail.set(false);
				}
				else if (desired - current > 1) {
					console.info("Current temperature ("+current+") below target ("+desired+"), enabling");
					powertail.set(true);
				}
			}, function (err) {
				console.log(err);
			});
		}, function (err) {
			console.log(err);
		});
	} else if (mode == 3) {
		console.info("Forced On");
		powertail.set(true);
	} else {
		console.info('Disabling');
		powertail.set(false)
	}
};



var determineIfComingHome = function() {
	database.getCoordinates(999999, 2, function(coordinates) {
		if (coordinates.length <= 1) {
			console.info("Insufficient samples, assuming off");
			determineState(0);
			return;
		}
		var place = coordinates[0];
		if (place.distance <= radii[1]) {
			console.info("We're really close, probably home (with wifi off)");
			determineState(1);
			return;
		}

		for (var i = 1; i < radii.length; i++) {
			if (place.distance <= radii[i]) {
				console.info("We're inside radii "+i+", distance: " + place.distance);
				database.getPreviousRing(radii[i-1], radii[i], function(result) {
					if (result[0].distance >= radii[i]) {
						console.info("Headed inland cap'n");
						//Now to determine how long you've been in the current radius ring
						var beenInRingFor = Math.floor(new Date() / 1000) - result[0].time;
						console.info("Been in ring for " + beenInRingFor);
						var maxRingTime = (radii[i]-radii[i-1])*100*config.coordinates.distCost * 60;
						console.info("maxRingTime " + maxRingTime);
						if (beenInRingFor <= maxRingTime) { //Planned feature: add falloff based on inner radius of ring
							//Since the goal of outer rings is to catch fast movement like a bus or car ride.
							//If you happen to walk the whole way or something, no need to have the heat on the whole tile.
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


exports.determineCurrentState = function() {
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
	};

exports.run = function() {
	setInterval(exports.determineCurrentState, 10 * 1000);
	exports.determineCurrentState();
};
