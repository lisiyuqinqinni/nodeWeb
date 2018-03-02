var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require("../models/Content")


var responseData;

router.use( function(req, res, next){
	responseData = {
		code: 0,
		message: ''
	}
	next();
})

router.post('/user/register',function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;

	if(username == ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		res.json(responseData);
		return 
	}
	if( password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空';
		res.json(responseData);
		return 
	}
	if( password !=  repassword){
		responseData.code = 3;
		responseData.message = '两次输入密码不一致';
		res.json(responseData);
		return 
	}
	//查询数据库用户名是否已经注册
	User.findOne({
		username: username
	}).then( function(userinfo){
		console.log(userinfo)
		if( userinfo ){
			responseData.code = 4;
			responseData.message = '用户名已经被注册';
			res.json(responseData);
			return
		}
		var user = new User({
			username: username,
			password: password
		});
		return user.save();
	}).then( function(newUserInfo){
		console.log(newUserInfo);
		responseData.message = '注册成功';
		res.json(responseData);
	})

	

});
router.post('/user/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	if(username=='' || password==''){
		responseData.code=1;
		responseData.message='账号或密码不能为空';
		res.json(responseData);
		return;
	}

	User.findOne({
		username:username,
		password:password
	}).then( userInfo => {
		if(!userInfo){
			responseData.code=2;
			responseData.message='账号或密码错误';
			res.json(responseData);
			return;
		}
		req.cookies.set('userInfo',JSON.stringify({
			_id:userInfo._id,
			username: userInfo.username
		}))
		responseData.message='登录成功';
		res.json(responseData);
	})
})
router.get('/user/logout',function(req, res){
	console.log("tuichu")
	req.cookies.set("userInfo",null);
	res.json(responseData);
})
//评论
router.get("/comment",function(req, res){
	var id = req.query.id;
	Content.findOne({
		_id: id
	}).then( content => {
		responseData.content = content;
		res.json(responseData);
	})
})
router.post("/content/comment",function(req, res){
	var id = req.body.id||"";
	var username = req.userInfo.username
	if(!username){
		responseData.code=1;
		responseData.message="请登录";
		res.json(responseData);
		return;
	}
	if(req.body.content){
		responseData.code=2;
		responseData.message="内容不能为空";
		res.json(responseData);
		return;
	}
	var data = {
		username: req.userInfo.username,
		comTime: new Date(),
		comment: req.body.comment
	}
	Content.findOne({
		_id: id
	}).then( content =>{
		content.comments.push(data);
		content.save();
		responseData.message="评论成功";
		responseData.content = content;
		res.json(responseData);
	})
})
module.exports = router;
