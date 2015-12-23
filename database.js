var mysql	= require('mysql');		//https://github.com/felixge/node-mysql

var config	= require('./config');

var pool	= mysql.createPool(config.mysql);



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
		console.log('connected as id ' + connection.threadId);
		
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
		funcOk(result[0]);
	}, funcErr);
};

exports.settingUpdate = function(setting, value, funcOk, funcErr) {
	query("UPDATE settings SET " + setting + " = :value", {"value":value}, funcOk, funcErr);
};



exports.query = query;
