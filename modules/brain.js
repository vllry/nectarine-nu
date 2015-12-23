var database = require('../database');
var temperature = require('./temperature');



exports.run = function() {
	setInterval(function() {
		temperature.getTemperature(function (current) {
			database.settingGet('temp', function(desired) {
				var desired = Number(desired.temp);
				console.log(desired);
				if (current - desired > 1) {
					console.log('off');
				}
				else if (current - desired < -1) {
					console.log('on')
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
	}, 10 * 1000);	//Every 10s
};
