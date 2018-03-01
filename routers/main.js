var express = require('express');
var router = express.Router();
var Entry = require("../models/Entry.js");
var Content = require("../models/Content.js")
var data;

//通用数据
router.use("/",function(req, res, next){
	data = {
		userInfo: req.userInfo,
		entries: []
	}
	Entry.find().then(entries => {
		data.entries = entries
		next();
	})
});

router.get('/',function(req, res, next){
	data.page =Number(req.query.page||1);
	data.entry= req.query.entry||"";
	data.pages=0;
	data.limit=10;
	var where = {};
	if( data.entry ){
		where.entry = data.entry;
	}
	
	Content.where(where).count().then( count => {
		data.pages = Math.ceil(count / data.limit);

		data.page = Math.min(data.page, data.pages);

		data.page = Math.max(data.page, 1);

		var skip = (data.page - 1)* data.limit;
		return Content.where(where).find().limit(data.limit).skip(skip).populate(["entry","user"]).sort({addTime: -1})
	}).then( contents => {
		data.contents = contents;
		res.render("main/index",data)
	})
	
});
router.get("/info",function(req, res){
	var id = req.query.contentId;
	Content.findOne({
		_id: id
	}).populate(["entry","user"]).then( content =>{
		data.content = content;

		content.readNum++;
		content.save();
		res.render("main/contentInfo",data)
	})
})
module.exports = router;