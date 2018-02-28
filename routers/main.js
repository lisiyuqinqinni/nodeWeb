var express = require('express');
var router = express.Router();
var Entry = require("../models/Entry.js")

router.get('/',function(req, res, next){
	Entry.find().then(entries => {
		res.render('main/index',{
			userInfo: req.userInfo,
			entries: entries
		})
	})
	
});
module.exports = router;