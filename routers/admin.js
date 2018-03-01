var express = require('express');
var router = express.Router();
var User = require("../models/User.js");
var Entry = require("../models/Entry.js");
var Content = require("../models/Content.js")



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
				limit: limit,
				url: "admin/user"
			})
		})
	})
	
	
});
//后台分类路由
router.get('/entry',function(req, res){
	//limit 查询多少条
	//skip 从第多少条之后查询

	var page = Number(req.query.page||1);
	var pages = 0;
	var limit = 10;

	Entry.count().then(function(count){
		
		pages = Math.ceil(count / limit);

		page = Math.min(page, pages);

		page = Math.max(page, 1);

		var skip = (page - 1)*limit;

		Entry.find().limit(limit).skip(skip).then(function(entrys){
			res.render("admin/entry",{
				userInfo: req.userInfo,
				entrys: entrys,

				count: count,
				page: page,
				pages: pages,
				limit: limit,
				url: "/admin/entry"
			})
		})
	})
	
});
router.get('/entry/add',function(req, res){
	res.render("admin/entryAdd",{
		userInfo: req.userInfo
	})
});
router.post("/entry/add", function(req, res){
	var name = req.body.name || "";
	if(name==""){
		res.render("admin/error",{
			userInfo: req.userInfo,
			message: "分类名称不能为空"
		})
		return;
	}
	Entry.findOne({name:name}).then( rs =>{
		if (rs){
			res.render("admin/error",{
				userInfo: req.userInfo,
				message: "分类名称已经被添加"
			})
			return;
		} else {
			var entry = new Entry({
				name:name
			})
			return entry.save();
		}
	}).then(rss =>{
		res.render("admin/success",{
			userInfo: req.userInfo,
			message: "分类名称添加成功",
			url: "/admin/entry"
		})
	})
	
});
//分类修改
router.get("/entry/entryEdit",function(req, res){
	var id = req.query.id || "";
	if(!id){
		res.render("admin/error",{
			userInfo: req.userInfo,
			message: "分类条目不存在"
		})
		return;
	}
	Entry.findOne({
		_id: id
	}).then(entry => {
		if(!entry){
			res.render("admin/error",{
				userInfo: req.userInfo,
				message: "分类条目不存在"
			})
		} else {
			res.render("admin/entry_edit",{
				userInfo: req.userInfo,
				entry: entry
			})
		}
	})
})
router.post("/entry/entryEdit",function(req, res){
	var id = req.query.id || "";
	var name = req.body.name || "";
	if(!id){
		res.render("admin/error",{
			userInfo: req.userInfo,
			message: "分类条目不存在"
		})
		return;
	}
	Entry.findOne({
		_id: id
	}).then( entry => {
		if(!entry){
			res.render("admin/error",{
				userInfo: req.userInfo,
				message: "分类条目不存在"
			})
		} else {
			//用户没有修改
			if(name == entry.name){
				res.render("admin/success",{
					userInfo: req.userInfo,
					message: "修改成功",
					url:"/admin/entry"
				})
				return Promise.reject();
			} else {
				//查询重名
				return Entry.findOne({
					_id: {$ne: id},
					name: name
				})
			}
			
		}
	}).then( entryOne =>{
		if(entryOne){
			res.render("admin/error",{
				userInfo: req.userInfo,
				message: "数据库中已经存在同名分类",
			})
			return Promise.reject();
		} else {
			return	Entry.update({_id: id},{name:name})
		}
	}).then(() =>{
		res.render("admin/success",{
			userInfo: req.userInfo,
			message: "修改成功",
			url:"/admin/entry"
		})
	})

});
// 分类删除 
router.get("/entry/del",function(req, res){
	var id = req.query.id || "";
	Entry.remove({_id:id}).then(()=>{
		res.render("admin/success",{
			userInfo: req.userInfo,
			message: "删除成功",
			url: "/admin/entry"
		})
	})
});

//内容列表
router.get("/content",function(req, res){
	var page = Number(req.query.page||1);
	var pages = 0;
	var limit = 10;

	Content.count().then(function(count){
		
		pages = Math.ceil(count / limit);

		page = Math.min(page, pages);

		page = Math.max(page, 1);

		var skip = (page - 1)*limit;

		Content.find().limit(limit).skip(skip).populate(["entry","user"]).then(function(contents){
			res.render("admin/content",{
				userInfo: req.userInfo,
				contents: contents,

				count: count,
				page: page,
				pages: pages,
				limit: limit,
				url: "/admin/content"
			})
		})
	})
	
})
//添加内容
router.get("/content/add",function(req, res){
	Entry.find().then( entries =>{
		res.render("admin/content_add",{
			userInfo: req.userInfo,
			entries: entries
		})
	})
	
});
router.post("/content/add",function(req, res){
	var content = req.body.content;
	var contentSim = req.body.contentSim;
	var entry = req.body.entry;
	var title = req.body.title;
	if (!content&&contentSim&&entry&&title){
		res.render("admin/error",{
			userInfo: req.userInfo,
			message:"添加内容不允许为空"
		})
		return;
	}
	new Content({
		entry:entry,
		title:title,
		user: req.userInfo._id.toString(),
		contentSim: contentSim,
		content: content
	}).save().then( rs => {
		res.render("admin/success",{
			userInfo: req.userInfo,
			message: "录入成功",
			url:"/admin/content"
		})
	})
});
router.get("/content/edit",function(req, res){
	var id = req.query.id||"";
	var entries = [];
	if(!id){
		res.render("admin/error",{
			userInfo: req.userInfo,
			message: "修改条目不存在"
		})
		return Promise.reject();
	} else {
		Entry.find().then( rs => {
			entries = rs;
			return Content.findOne({
				_id: id
			})
		}).then( content => {
			if(!content){
				res.render("admin/error",{
					userInfo: req.userInfo,
					message: "修改条目不存在"
				})
				return Promise.reject();
			} else {
				res.render("admin/content_edit",{
					userInfo: req.userInfo,
					entries: entries,
					content: content

				})
			}
		})
	}
});
router.post("/content/edit",function(req, res){
	var id = req.query.id||"";
	var title = req.body.title||"";
	var entry = req.body.entry||"";
	var contentSim = req.body.contentSim||"";
	var content = req.body.content||"";
	if(!id&&title&&entry&&contentSim&&content){
		res.render("admin/error",{
			userInfo: req.userInfo,
			message: "内容不允许为空"
		})
		return;
	}
	Content.update({_id:id},{
		title: title,
		entry: entry,
		contentSim: contentSim,
		content: content
	}).then( rs => {
		res.render("admin/success",{
			userInfo: req.userInfo,
			message: "修改成功",
			url: "/admin/content"
		})
	})
});
router.get("/content/del",function(req, res){
	var id = req.query.id;
	Content.remove({
		_id: id
	}).then( rs => {
		res.render("admin/success",{
			userInfo: req.userInfo,
			message: "删除成功",
			url: "/admin/content"
		})
	})
});

module.exports = router;
