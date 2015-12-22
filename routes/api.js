var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.json({'success':true});
});

router.post('/settings/mode', function(req, res) {
	console.log(req.body);
	res.json({'success':true});
});

router.post('/settings/temp', function(req, res) {
	console.log(req.body);
	res.json({'success':true});
});

module.exports = router;
