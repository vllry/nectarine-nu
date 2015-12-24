var database = require('../database');
var temperature = require('./temperature');
var powertail = require('./powertail');



exports.run = function() {
	setInterval(function() {
		database.settingGet('mode', function(mode) {
			console.log(mode);
			if (mode == 1) {
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
			else if (mode == 0) {
				console.log('off mode');
				powertail.set(false)
			}
		}, function (err) {
			console.log(err);
		});
	}, 20 * 1000);	//Every 20s
};
