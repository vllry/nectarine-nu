var express = require('express');
var router = express.Router();

var database = require('../database');
var temperature = require('../modules/temperature');




router.get('/', function(req, res) {
	res.json({'success':true});
});

router.route('/settings/mode')
	.get(function(req, res) {
		database.settingGet('mode', function(result) {
			res.json({'success':true, 'result':result});
		}, function(err) {
			res.json({'success':false, 'err':err});
		});
	})
	.post(function(req, res) {
		database.settingUpdate('mode', req.body.mode, function(result) {
			res.json({'success':true, 'message':'Setting saved', 'result':result});
		}, function(err) {
			res.json({'success':false, 'message':'Setting not saved', 'err':err});
		});
	})


router.route('/settings/temp')
	.get(function(req, res) {
		database.settingGet('temp', function(result) {
			res.json({'success':true, 'result':result});
		}, function(err) {
			res.json({'success':false, 'err':err});
		});
	})
	.post(function(req, res) {
		database.settingUpdate('temp', req.body.temp, function(result) {
			res.json({'success':true, 'message':'Setting saved', 'result':result});
		}, function(err) {
			res.json({'success':false, 'message':'Setting not saved', 'err':err});
		});
	})


router.route('/status/temp')
	.get(function(req, res) {
		temperature.getTemperature(function(result) {
			res.json({'success':true, 'value':result.toString()});
		}, function(err) {
			res.json({'success':false, 'err':err});
		});
	})


router.route('/gps')
	.get(function(req, res) {
		database.addCoordinates(Number(req.query.lat), Number(req.query.lon), function(result) {
			res.json({'success':true});
		}, function(err) {
			res.json({'success':false, 'err':err});
		});
	})



module.exports = router;
