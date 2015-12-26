var mysql	= require('mysql');		//https://github.com/felixge/node-mysql

var config	= require('./config');

var pool	= mysql.createPool(config.mysql);



/*
Before you say MySQL is overkill, let me explain you a thing

	* I didn't want to just use files because of the GPS data stuff
	* MongoDB (the usual choice in this situation) has a lot of "fun" quirks, and they're dropping non-64-bit support
	* "The" SQLite module doesn't work (lol)
	* I already had code to copy-penne from another project
*/

var query = function(query, paramDict, funcOK, funcErr) {
	pool.getConnection(function(err,connection){
		if (err) {
			if (connection) {
				connection.release();
			}
			funcErr(err);
			connection.release();
			return;
		}  
		//console.log('connected as id ' + connection.threadId);
		
		connection.config.queryFormat = function (query, values) {
			if (!values) return query;
				return query.replace(/\:(\w+)/g, function (txt, key) {
				if (values.hasOwnProperty(key)) {
					return this.escape(values[key]);
				}
				return txt;
			}.bind(this));
		};

		connection.query(query, paramDict, function(err, result) {
			if (err) {
				funcErr(err);
			}
			else {
				funcOK(result);
			}
		});
		connection.release(); //If you forget this line, you will have a very bad day
	});
};



exports.settingGet = function(setting, funcOk, funcErr) {
	query("SELECT " + setting + " FROM settings", {}, function(result) {
		funcOk(Number(result[0][setting]));
	}, funcErr);
};



exports.settingUpdate = function(setting, value, funcOk, funcErr) {
	query("UPDATE settings SET " + setting + " = :value", {"value":value}, funcOk, funcErr);
};



exports.addCoordinates = function(lat, lon, funcOk, funcErr) {
	var distance = Math.sqrt( Math.abs(Math.pow(config.coordinates.home.lat-lat, 2) + Math.pow(config.coordinates.home.lon-lon, 2)) );
	console.log(distance);
	query("INSERT INTO coordinates(lat, lon, distance) VALUES(:lat, :lon, :dist)", {"lat":lat, "lon":lon, "dist":distance}, funcOk, funcErr);
};



exports.getCoordinates = function(withinTime, num, funcOk, funcErr) {
	query("SELECT * FROM coordinates WHERE time > UNIX_TIMESTAMP() - :withinTime ORDER BY time DESC LIMIT :lim", {"withinTime":withinTime, "lim":num}, funcOk, funcErr);
};



exports.getPreviousRing = function(ringInner, ringOuter, funcOk, funcErr) {
	query("SELECT time,distance FROM coordinates WHERE distance < :ringInner OR distance >= :ringOuter ORDER BY time DESC LIMIT 1", {"ringInner":ringInner, "ringOuter":ringOuter}, funcOk, funcErr);
};



/*exports.getTimeInRing = function(ringInner, ringOuter, funcOk, funcErr) {
	query("\
SELECT time FROM coordinates WHERE distance >= :ringInner AND distance < :ringOuter ORDER BY time DESC LIMIT 1\
", {"ringInner":ringInner, "ringOuter":ringOuter}, funcOk, funcErr);
};*/



exports.query = query;
