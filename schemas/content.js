var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //关联分类表
    entry: {
        type:mongoose.SchemaTypes.ObjectId,
        ref: "Entry"
    },
     //关联用户表
    user: {
        type:mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    addTime:{
        type: String,
        default: new Date()
    },
    readNum:{
        type: Number,
        default: 0
    },
	//内容标题名称
    title: String,
    //内容简介
    contentSim:{
        type: String,
        default: ""
    },
    //内容
    content:{
        type: String,
        default: ""
    },
    //评论
    comments:{
        type: Array,
        default:[]
    }
});