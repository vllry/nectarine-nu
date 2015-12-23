var express = require('express');
var router = express.Router();

var database = require('../database');




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



module.exports = router;
