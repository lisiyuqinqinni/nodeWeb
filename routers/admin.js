var express = require('express');
var router = express.Router();
var User = require("../models/User.js")



router.use(function(req, res, next){
	if(!req.userInfo.isAdmin){
		res.send("只有管理员可以进入");
		return;
	}
	next();
})
//管理首页
router.get('/',function(req, res, next){
	res.render('admin/index',{
		userInfo: req.userInfo
	})
});
//用户列表
router.get("/user",function(req, res){
	//limit 查询多少条
	//skip 从第多少条之后查询

	var page = Number(req.query.page||1);
	var pages = 0;
	var limit = 10;

	User.count().then(function(count){

		pages = Math.ceil(count / limit);

		page = Math.max(page, 1);

		page = Math.min(page, pages);

		var skip = (page - 1)*limit;

		User.find().limit(limit).skip(skip).then(function(users){
			res.render("admin/user_index",{
				userInfo: req.userInfo,
				users: users,

				count: count,
				page: page,
				pages: pages,
				limit: limit
			})
		})
	})
	
	
})
module.exports = router;