var fs = require('fs');

var config = require('../config')



exports.getTemperature = function(funcOk, funcErr) {
	fs.readFile('/sys/bus/w1/devices/'+config.tempSensor+'/w1_slave', 'utf8', function(err, contents) {
		if (err) {
			console.log(err);
			funcErr(err);
		}
		else {
			temp = Number(contents.split('t=')[1].replace('\n', ''))/1000;
			funcOk(temp);
		}
	});
};
