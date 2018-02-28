var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //关联分类表
    entry: {
        type:mongoose.SchemaTypes.ObjectId,
        ref: "Content"
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
    }
});