var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.json({'success':true});
});

router.post('/settings/mode', function(req, res) {
	console.log(req.body);
	res.json({'success':true});
});

module.exports = router;
