var express = require('express');
var router = express.Router();

var database = require('../database');

router.get('/', function(req, res) {
	res.json({'success':true});
});

router.post('/settings/mode', function(req, res) {
	database.settingUpdate('mode', req.body.mode, function(result) {
		res.json({'success':true, 'message':'Setting saved', 'result':result});
	}, function(err) {
		res.json({'success':false, 'message':'Setting not saved', 'err':err});
	});
});

router.post('/settings/temp', function(req, res) {
	database.settingUpdate('temp', req.body.temp, function(result) {
		res.json({'success':true, 'message':'Setting saved', 'result':result});
	}, function(err) {
		res.json({'success':false, 'message':'Setting not saved', 'err':err});
	});
});

module.exports = router;
