var express = require('express');

var app = express();

//加载模板模块
var swig = require('swig');

//加载数据库模块
var mongoose = require('mongoose');

//设置静态文件托管
app.use('/public', express.static(__dirname + '/public'))

//处理post请求
var bodyParser = require('body-parser');

//body-parser设置
app.use( bodyParser.urlencoded({extended: true}));

//配置模板模块
//定义当前应用所使用的模板引擎
app.engine('html', swig.renderFile);

//开发模式下取消模板缓存
swig.setDefaults({cache: false});

//设置模板文件存放的目录
app.set('views', './views');

//注册所使用的模板引擎，第一个参数必须是view engine
app.set('view engine', 'html');


/*根据不同的功能分化模块*/
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'))

mongoose.connect('mongodb://localhost:27018/nodeWeb', function(err) {
	if(err){
		console.log('链接数据库失败');
	} else {
		console.log('链接数据库成功');
		app.listen(8081)
	}
});

