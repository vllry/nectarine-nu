var database = require('../database');
var temperature = require('./temperature');
var powertail = require('./powertail');



exports.run = function() {
	setInterval(function() {
		temperature.getTemperature(function (current) {
			database.settingGet('temp', function(desired) {
				var desired = Number(desired.temp);
				if (current - desired > 1) {
					powertail.set(false);
				}
				else if (current - desired < -1) {
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
	}, 20 * 1000);	//Every 20s
};
